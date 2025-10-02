import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json({ type: "application/json" }));

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // IMPORTANT: use service key, NOT public key
);

// Webhook from Lemon
app.post("/api/lemon-webhook", async (req, res) => {
  const event = req.body;

  // Verify webhook (you can add signing secret check here)
  if (event.type === "order_created") {
    const email = event.data.attributes.user_email;
    const variantId = event.data.attributes.first_order_item.variant_id;

    // Match Lemon variant ID to coin amounts
    const packageMap = {
      "1022523": 100,
      "VARIANT_ID_250": 275,
      "VARIANT_ID_500": 575,
      "VARIANT_ID_1000": 1200,
      "VARIANT_ID_2500": 3000,
      "VARIANT_ID_5000": 6200,
      "VARIANT_ID_10000": 13000,
      "VARIANT_ID_20000": 27500,
    };

    const coins = packageMap[variantId] || 0;

    if (coins > 0) {
      // Find user in Supabase by email
      const { data: user, error: userErr } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!userErr && user) {
        // Increment balance
        await supabase.rpc("add_coins", { user_id: user.id, coins });
        console.log(`Added ${coins} coins to ${email}`);
      }
    }
  }

  res.json({ received: true });
});

// Start server
app.listen(3000, () => console.log("🚀 Webhook server running on http://localhost:3000"));
