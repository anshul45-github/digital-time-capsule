export default function About() {
    const faqs = [
      {
        question: "What is TimeCapsule?",
        answer: "TimeCapsule is a digital platform where you can create, store, and share memories that are locked until a future date. It's like a traditional time capsule, but for the digital age!"
      },
      {
        question: "How do APT rewards work?",
        answer: "APT is our platform's reward token. You can earn APT when others unlock your capsules early, and spend APT to unlock others' capsules before their scheduled date."
      },
      {
        question: "What is a Time Traveller badge?",
        answer: "The Time Traveller badge is our highest honor, awarded to active community members. It grants special privileges like temporarily viewing any public capsule."
      },
      {
        question: "How do I create a time capsule?",
        answer: "Click the 'Create Capsule' button, upload your content (photos, videos, or text), set an unlock date, and choose who can access it. You can also add APT rewards for early unlocks!"
      }
    ];
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">About TimeCapsule</h1>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              We believe in preserving memories in a unique way that brings people together. 
              TimeCapsule lets you create digital time capsules that can be shared and opened 
              collectively, making memory sharing a social experience.
            </p>
            <p className="text-gray-700">
              Whether it's graduation photos, wedding memories, or community stories, 
              TimeCapsule helps you preserve these moments and unlock them at just the right time.
            </p>
          </div>
  
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }