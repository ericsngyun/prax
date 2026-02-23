'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';
import { getMobileAnimationConfig } from '@/lib/mobileAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  label?: string;
  heading?: string;
  description?: string;
  items?: FAQItem[];
}

const defaultItems: FAQItem[] = [
  {
    question: 'How often should I book an appointment?',
    answer:
      'We recommend every 3-4 weeks to maintain shape and precision. Our cuts are designed to grow out naturally, but regular maintenance ensures the best results.',
  },
  {
    question: 'Can I request a specific barber?',
    answer:
      'Yes. When booking online, you can select your preferred artist. Each team member holds themselves to the same standard of precision and craft.',
  },
  {
    question: 'What if I don't like my haircut?',
    answer:
      'We stand behind our work. If you're not satisfied, contact us within 7 days and we'll make it right. Our goal is precision, consistency, and your confidence.',
  },
  {
    question: 'Do you accept walk-ins?',
    answer:
      'No. PRAX operates by appointment only to ensure each client receives our full attention and time. This allows us to deliver the level of craft we're known for.',
  },
  {
    question: 'Where are you located?',
    answer:
      'We're based in Los Angeles, California. Our studio is designed for focus and calm—a space that reflects the precision of our work.',
  },
  {
    question: 'What's included in the Signature Cut?',
    answer:
      'Every Signature Cut includes consultation, precision cutting, detailing, styling, product recommendations, and maintenance guidance. Approximately 60-75 minutes.',
  },
  {
    question: 'Do you sell products?',
    answer:
      'Yes. We carry a curated selection of grooming products we personally use and recommend. All products are tested for quality and performance.',
  },
  {
    question: 'How do I prepare for my appointment?',
    answer:
      'Come with clean, dry hair. Bring reference photos if you have a specific style in mind. Most importantly, arrive ready to communicate openly about your goals.',
  },
];

export function FAQSection({
  label = 'Questions',
  heading = 'Frequently Asked',
  description = 'Common questions about booking, services, and what to expect at PRAX.',
  items = defaultItems,
}: FAQSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const config = getMobileAnimationConfig();

    const ctx = gsap.context(() => {
      // Header fade-up
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: config.yOffset,
        duration: config.duration * 2,
        ease: config.ease,
      });

      // FAQ items stagger
      const faqItems = sectionRef.current?.querySelectorAll('.faq-item');
      if (faqItems) {
        gsap.from(faqItems, {
          scrollTrigger: {
            trigger: faqItems[0],
            start: 'top 85%',
          },
          opacity: 0,
          y: config.yOffset,
          duration: config.duration * 1.5,
          stagger: config.stagger,
          ease: config.ease,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="section-padding bg-prax-ink">
      <div className="container-prax">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-label text-prax-bone uppercase tracking-widest block mb-4">
            {label}
          </span>
          <h2 className="text-h1 text-prax-white mb-6">{heading}</h2>
          {description && (
            <p className="text-body-lg text-prax-stone leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-2">
          {items.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => toggleItem(index)}
              number={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ ITEM (Accordion)
   ═══════════════════════════════════════════════════════════════════════════ */

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  number: number;
}

function FAQItem({ question, answer, isOpen, onClick, number }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!contentRef.current || !answerRef.current || prefersReducedMotion()) return;

    if (isOpen) {
      gsap.to(contentRef.current, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(answerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.1,
        ease: 'power2.out',
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.set(answerRef.current, {
        opacity: 0,
        y: -8,
      });
    }
  }, [isOpen]);

  return (
    <div className="faq-item border-t border-prax-graphite last:border-b">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between gap-6 text-left group hover:bg-prax-charcoal/20 transition-colors duration-300 px-6 md:px-8"
        aria-expanded={isOpen}
      >
        {/* Number */}
        <span className="text-label text-prax-bone opacity-60 flex-shrink-0 hidden md:block">
          {String(number).padStart(2, '0')}
        </span>

        {/* Question */}
        <span className="text-body-lg md:text-h4 text-prax-white flex-1 group-hover:text-prax-bone transition-colors duration-300">
          {question}
        </span>

        {/* Toggle Icon */}
        <div className="flex-shrink-0 w-6 h-6 relative">
          <span
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-prax-white transition-all duration-300`}
          />
          <span
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3 bg-prax-white transition-all duration-300 ${
              isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
            }`}
          />
        </div>
      </button>

      {/* Answer (Accordion Content) */}
      <div ref={contentRef} className="h-0 overflow-hidden">
        <div className="px-6 md:px-8 pb-6 md:pl-[5.5rem]">
          <p
            ref={answerRef}
            className="text-body text-prax-stone leading-relaxed opacity-0"
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
