import React, { useState } from 'react';
import { SiteContent } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { MessageCircle, Mail, MapPin, Instagram, Sparkles, Send, CheckCircle2, Clock, Truck, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';
import { sendContactMessage, uploadSiteImage } from '../lib/supabase';

interface ContactPageProps {
  siteContent: SiteContent;
}

export const ContactPage: React.FC<ContactPageProps> = ({ siteContent }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    await sendContactMessage({
      name,
      contact,
      email,
      subject: subject || 'General Inquiry',
      message: attachedImage ? `${message}\n[Attached Outfit Photo]: ${attachedImage}` : message,
    });

    setIsSent(true);
    setName('');
    setContact('');
    setEmail('');
    setSubject('');
    setMessage('');
    setAttachedImage('');
  };

  const handleDirectWhatsApp = () => {
    const url = generateGeneralInquiryWhatsAppUrl(
      'Salam Sania! 🌸 I am reaching out from your contact page regarding an order inquiry.',
      siteContent.whatsapp_number
    );
    openWhatsApp(url);
  };

  const faqs = siteContent.faqs && siteContent.faqs.length > 0 ? siteContent.faqs : [
    {
      id: 'faq-1',
      q: 'How long does a customized handmade dupatta take to craft?',
      a: 'Standard hand-painted dupattas take approximately 4–7 business days to hand-paint, set, and stitch. Complex bridal veils with custom Urdu calligraphy and gotta jaals take 10–14 days. Express orders can often be accommodated on request via WhatsApp.',
    },
    {
      id: 'faq-2',
      q: 'How do I match the dupatta to my existing dress?',
      a: 'Simply take clear photos of your dress fabric / sleeve in natural daylight and send it via our Customizer upload or directly in our WhatsApp chat (+92 371 6747099). Sania mixes custom artist dyes to match your exact shade.',
    },
    {
      id: 'faq-3',
      q: 'Do you deliver across Pakistan and internationally?',
      a: 'Yes! We deliver nationwide across Pakistan (Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Multan, and all cities) via express courier. We also ship worldwide to the UK, USA, Canada, UAE, Saudi Arabia, and Australia via DHL/FedEx Express.',
    },
    {
      id: 'faq-4',
      q: 'Are the hand-painted colors washable?',
      a: 'Yes, we use professional grade non-toxic textile acrylics that permanently cure into the fabric fibers. We recommend dry cleaning or gentle cold hand-washing for prolonged longevity.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF0F3] border border-[#F3C5D4] text-[#BE185D] text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{siteContent.contact_badge || 'Get in Touch With Sania'}</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#3D2C2E]">
          {siteContent.contact_title || 'We’d Love to Hear From You'}
        </h1>
        <p className="text-sm text-[#7A5A62] font-sans-clean leading-relaxed">
          {siteContent.contact_subtitle ||
            'The fastest way to reach us is directly on WhatsApp. For custom bridal consultations, outfit color-matching, or general inquiries, our studio is always here to help.'}
        </p>
      </div>

      {/* Main Contact Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Direct WhatsApp, Email, & Social Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Primary WhatsApp Card */}
          <div className="bg-gradient-to-br from-[#25D366] via-[#20BA5A] to-[#128C7E] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <MessageCircle className="w-7 h-7 fill-current" />
              </div>
              <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Instant Chat
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-luxury text-2xl font-bold">
                {siteContent.contact_desk_title || 'WhatsApp Order Desk'}
              </h3>
              <p className="text-xs text-white/90">
                {siteContent.contact_desk_desc || 'Direct chat with Sania for orders, custom swatches, and updates.'}
              </p>
            </div>

            <div className="font-mono text-xl font-bold tracking-wider pt-1">
              {siteContent.display_whatsapp || '+92 371 6747099'}
            </div>

            <button
              onClick={handleDirectWhatsApp}
              className="w-full py-3.5 px-4 bg-white text-[#128C7E] rounded-2xl font-bold text-sm shadow-md hover:bg-[#FFF8F9] transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Start WhatsApp Conversation</span>
            </button>
          </div>

          {/* Email & Location Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
            
            {/* Email */}
            <a
              href={`mailto:${siteContent.email || 'brushnfabric@gmail.com'}`}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#FFF0F3] transition-colors group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] text-[#831843] group-hover:bg-[#831843] group-hover:text-white flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#9D7983] uppercase font-bold">Email Inquiries</div>
                <div className="text-sm font-semibold text-[#3D2C2E]">{siteContent.email || 'brushnfabric@gmail.com'}</div>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-4 p-3 rounded-2xl">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] text-[#831843] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#BE185D]" />
              </div>
              <div>
                <div className="text-[11px] text-[#9D7983] uppercase font-bold">Studio Origin</div>
                <div className="text-sm font-semibold text-[#3D2C2E]">{siteContent.studio_location || 'Lahore, Pakistan • Worldwide Delivery'}</div>
              </div>
            </div>

          </div>

          {/* Social Channels (Instagram & TikTok) */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#FCE7EB] space-y-4">
            <h4 className="font-serif-luxury text-base font-bold text-[#831843]">
              Follow Our Daily Handcrafted Journey
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Instagram */}
              <a
                href={siteContent.instagram_url || 'https://www.instagram.com/brushandfabricby_sania?igsi=MTI5OTdjaTAyNWh3Yg=='}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#FCE7EB] hover:border-[#E1306C] text-[#3D2C2E] hover:text-[#E1306C] shadow-2xs transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Instagram</div>
                  <div className="text-[10px] text-[#7A5A62] truncate">@brushandfabric</div>
                </div>
              </a>

              {/* TikTok */}
              <a
                href={siteContent.tiktok_url || 'https://www.tiktok.com/@brushandfabricby_sania?_r=1&_t=ZS-99OZxHoWsfF'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#FCE7EB] hover:border-black text-[#3D2C2E] hover:text-black shadow-2xs transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-black/10 text-black flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.29c.02 1.95-.57 3.96-1.8 5.48-1.46 1.83-3.79 2.87-6.15 2.72-2.84-.13-5.38-2.03-6.19-4.75-.98-3.13.68-6.66 3.75-7.85 1.09-.43 2.29-.53 3.44-.34v4.06c-.66-.2-1.4-.23-2.04-.03-.98.27-1.74 1.1-1.88 2.09-.23 1.34.61 2.67 1.93 2.98 1.15.28 2.45-.16 3.03-1.2.3-.52.41-1.12.4-1.72V.02h-2.52z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">TikTok</div>
                  <div className="text-[10px] text-[#7A5A62] truncate">@brushandfabric</div>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Web Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#FCE7EB] shadow-md space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#3D2C2E]">
              Send a Message to Our Studio
            </h3>
            <p className="text-xs text-[#7A5A62]">
              Prefer web message? Fill in the details below and we will get back to you via email or WhatsApp.
            </p>
          </div>

          {isSent ? (
            <div className="bg-[#FFF0F3] p-8 rounded-2xl border border-[#F3C5D4] text-center space-y-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto" />
              <h4 className="font-serif-luxury text-xl font-bold text-[#831843]">
                Message Received!
              </h4>
              <p className="text-xs text-[#5C3A42] max-w-sm mx-auto">
                Thank you for reaching out! Sania will review your inquiry and respond shortly. For urgent inquiries, please chat on WhatsApp.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-2 text-xs font-bold text-[#BE185D] hover:underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#831843] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Ali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#831843] mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0300 1234567"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#831843] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#831843] mb-1">
                    Subject / Occasion
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bridal Nikkah Veil Inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#831843] mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about the dupatta you're looking for, required colors, or event date..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
                />
              </div>

              {/* Attach Dress / Swatch Reference Photo */}
              <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB]">
                <ImageUploader
                  label="Attach Dress / Fabric Photo (Optional)"
                  description="Upload your dress or fabric swatch to match colors"
                  value={attachedImage}
                  onChange={(url) => setAttachedImage(url as string)}
                  uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'references')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-bold text-xs shadow-md hover:from-[#9D174D] hover:to-[#701237] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-[#FFF8F9] rounded-3xl p-8 sm:p-12 border border-[#FCE7EB] space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D2C2E]">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-[#7A5A62]">
            Everything you need to know about ordering your handmade dupatta.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#FCE7EB] overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#3D2C2E] hover:text-[#831843] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#BE185D]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-[#9D7983]" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#5C3A42] leading-relaxed border-t border-[#FFF0F3] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
