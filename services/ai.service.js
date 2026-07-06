const Groq = require("groq-sdk");
const AiSummary = require("../models/AiSummary");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateBookingSummary = async (booking, customer, event) => {
  const prompt = `
Generate a professional booking confirmation summary in 3-4 lines.

Customer Name: ${customer.name}
Customer Email: ${customer.email}
Event: ${event.title}
Event Date: ${event.date}
Tickets: ${booking.tickets}
Total Amount: ₹${booking.totalAmount}
Booking Status: ${booking.bookingStatus}

Only return the summary.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 150,
    });

    const summary =
      completion.choices[0].message.content.trim();

    const aiSummary = await AiSummary.create({
      booking: booking._id,
      summary,
      type: "Booking Summary",
    });

    return aiSummary;
  } catch (error) {
    console.error("Groq Error:", error);

    // Fallback summary
    const summary = `${customer.name} successfully booked ${booking.tickets} ticket(s) for "${event.title}". Booking status is ${booking.bookingStatus} and the total payable amount is ₹${booking.totalAmount}.`;

    const aiSummary = await AiSummary.create({
      booking: booking._id,
      summary,
      type: "Booking Summary",
    });

    return aiSummary;
  }
};

module.exports = {
  generateBookingSummary,
};