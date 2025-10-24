import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_TARGETS = {
  protein: 50,
  carbs: 250,
  fat: 70,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get last order
    const { data: lastOrder, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      console.error('Order fetch error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch orders' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const previousNutrients = lastOrder ? {
      protein: parseFloat(lastOrder.total_protein),
      carbs: parseFloat(lastOrder.total_carbs),
      fat: parseFloat(lastOrder.total_fat),
    } : { protein: 0, carbs: 0, fat: 0 };

    const remainingTarget = {
      protein: Math.max(0, DAILY_TARGETS.protein - previousNutrients.protein),
      carbs: Math.max(0, DAILY_TARGETS.carbs - previousNutrients.carbs),
      fat: Math.max(0, DAILY_TARGETS.fat - previousNutrients.fat),
    };

    // Fetch menu to suggest items
    const { data: menuItems, error: menuError } = await supabaseClient
      .from('menu')
      .select('*');

    if (menuError) {
      console.error('Menu fetch error:', menuError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch menu' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Score each item based on how well it fills the remaining gaps
    const scoredItems = menuItems.map((item) => {
      const proteinScore = remainingTarget.protein > 0 ? 
        Math.min(parseFloat(item.protein) / remainingTarget.protein, 1) : 0;
      const carbsScore = remainingTarget.carbs > 0 ? 
        Math.min(parseFloat(item.carbs) / remainingTarget.carbs, 1) : 0;
      const fatScore = remainingTarget.fat > 0 ? 
        Math.min(parseFloat(item.fat) / remainingTarget.fat, 1) : 0;
      
      // Penalize items that would exceed targets significantly
      const proteinOverage = previousNutrients.protein > DAILY_TARGETS.protein ? 
        Math.max(0, 1 - parseFloat(item.protein) / 10) : 1;
      const fatOverage = previousNutrients.fat > DAILY_TARGETS.fat ? 
        Math.max(0, 1 - parseFloat(item.fat) / 5) : 1;

      const score = (proteinScore * 2 + carbsScore + fatScore) * proteinOverage * fatOverage;

      return { ...item, score };
    });

    // Sort by score and take top 3
    const suggestedItems = scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ id, name, protein, carbs, fat, price }) => ({
        id,
        name,
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        price: parseFloat(price),
      }));

    console.log('Recommendations generated for user:', user.id);

    return new Response(
      JSON.stringify({
        previous_nutrients: previousNutrients,
        remaining_target: remainingTarget,
        suggested_items: suggestedItems,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
