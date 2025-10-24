import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid items' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch menu items to calculate nutrients
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

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalPrice = 0;

    const orderItems = items.map((item: { id: string; quantity: number }) => {
      const menuItem = menuItems.find((m) => m.id === item.id);
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.id}`);
      }

      const itemProtein = parseFloat(menuItem.protein) * item.quantity;
      const itemCarbs = parseFloat(menuItem.carbs) * item.quantity;
      const itemFat = parseFloat(menuItem.fat) * item.quantity;
      const itemPrice = parseFloat(menuItem.price) * item.quantity;

      totalProtein += itemProtein;
      totalCarbs += itemCarbs;
      totalFat += itemFat;
      totalPrice += itemPrice;

      return {
        id: menuItem.id,
        name: menuItem.name,
        quantity: item.quantity,
        price: parseFloat(menuItem.price),
      };
    });

    // Insert order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        items: orderItems,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
        total_price: totalPrice,
        payment_method: 'qr',
        payment_status: 'completed',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order);

    return new Response(
      JSON.stringify({ order }),
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
