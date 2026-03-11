import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { student_name, student_email, phone_number, whatsapp_no, requirements } = await req.json()
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Examfriendly Registration <info@noreply.examfriendly.in>", // Replace with your domain once verified
        to: [student_email],
        subject: `Registration Confirmed: Class 9 CBSE 2026-27`,
        html: `
          <div style="font-family: sans-serif; border: 2px solid #00BFFF; padding: 20px; border-radius: 12px;">
            <h2 style="color: #00BFFF;">Hello ${student_name}!</h2>
            <p>Your registration for <b>Class 9 | CBSE 2026-27</b> has been received.</p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
               <p><b>Phone:</b> ${phone_number}</p>
               <p><b>WhatsApp:</b> ${whatsapp_no}</p>
               <p><b>Requirements:</b> ${requirements || 'N/A'}</p>
            </div>
            <p style="color: #FF8C00; font-weight: bold;">Our team will contact you shortly.</p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400 
    })
  }
})