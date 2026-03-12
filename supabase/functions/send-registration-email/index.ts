import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight for the browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Destructuring all the new fields from your modern form
    const { 
      student_name, 
      student_email, 
      whatsapp_no, 
      parent_name, 
      parent_contact, 
      student_age, 
      student_grade, 
      school_name, 
      coding_experience,
      course_name 
    } = await req.json()

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ExamFriendly <info@noreply.examfriendly.in>",
        to: [student_email],
        subject: `Registration Confirmed: ${course_name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #00BFFF; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Registration Confirmed!</h1>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff; color: #333333;">
              <p style="font-size: 16px;">Dear <b>${parent_name}</b>,</p>
              <p style="font-size: 16px;">Thank you for registering <b>${student_name}</b> for our <b>${course_name}</b> program. We are excited to have you join us!</p>
              
              <div style="background-color: #f9fbfd; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #00BFFF;">
                <h3 style="color: #00BFFF; margin-top: 0; font-size: 14px; text-transform: uppercase;">Student Profile</h3>
                <p style="margin: 5px 0;"><b>Age:</b> ${student_age}</p>
                <p style="margin: 5px 0;"><b>Grade:</b> ${student_grade}</p>
                <p style="margin: 5px 0;"><b>School:</b> ${school_name}</p>
                <p style="margin: 5px 0;"><b>Coding Experience:</b> ${coding_experience}</p>
              </div>

              <div style="background-color: #fff8f0; border-radius: 12px; padding: 20px; border: 1px solid #FF8C00;">
                <h3 style="color: #FF8C00; margin-top: 0; font-size: 14px; text-transform: uppercase;">Contact Details</h3>
                <p style="margin: 5px 0;"><b>Parent Contact:</b> ${parent_contact}</p>
                <p style="margin: 5px 0;"><b>WhatsApp Number:</b> ${whatsapp_no}</p>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">Our team will reach out to you on WhatsApp within 24 hours to discuss the next steps and batch timings.</p>
            </div>
            
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              © 2026 ExamFriendly. All rights reserved.
            </div>
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