/**
 * Smooth scroll to section
 */
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
  }
};

/**
 * Scroll to contact form
 */
export const scrollToContact = () => {
  scrollToSection('final-cta');
};

/**
 * Scroll to FAQ section  
 */
export const scrollToFAQ = () => {
  scrollToSection('faq');
};

/**
 * Scroll to cost calculator
 */
export const scrollToCostCalculator = () => {
  scrollToSection('kalkulator');
};

/**
 * Scroll to case study section
 */
export const scrollToCaseStudy = () => {
  scrollToSection('case-study');
};

/**
 * Open external link
 */
export const openExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Call phone number
 */
export const callPhone = (phoneNumber: string) => {
  window.location.href = `tel:${phoneNumber}`;
};

/**
 * Send email
 */
export const sendEmail = (email: string, subject?: string) => {
  const mailtoUrl = subject 
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
  window.location.href = mailtoUrl;
}; 