/**
 * SEO-optimized FAQs for each dog listing.
 * Used on the dog detail page and injected as FAQPage schema for rich results.
 */
export interface DogFaq {
  question: string;
  answer: string;
}

export const dogFaqs: Record<string, DogFaq[]> = {
  duke: [
    { question: "What is Duke's temperament like?", answer: 'Duke is confident, loyal and surprisingly gentle with children, while still carrying the sturdy build the American Bully is known for.' },
    { question: 'Is Duke good with other dogs?', answer: 'Duke prefers to be the primary dog in the household and does best without other male dogs.' },
    { question: 'What health testing has Duke completed?', answer: 'Duke is fully vet-checked, vaccinated, neutered and microchipped, with a written health guarantee.' },
    { question: 'Can Duke be shipped to another state?', answer: 'Yes, we arrange safe, ground-transport nationwide delivery to your door.' },
    { question: "What is Duke's price?", answer: "Duke's price is $2,500, which covers his health testing, microchipping, vaccinations and starter supplies." },
  ],
  bella: [
    { question: "What is Bella's personality?", answer: 'Bella is playful, curious and highly people-focused — a classic affectionate Pocket Bully temperament.' },
    { question: 'Does Bella get along with other pets?', answer: 'Yes, Bella is well-socialized with other dogs and cats.' },
    { question: 'How big will Bella get?', answer: 'As a Pocket Bully, Bella is expected to mature around 15 lbs.' },
    { question: 'Is Bella vaccinated?', answer: 'Yes, Bella has had her first round of puppy vaccinations and a full vet check.' },
    { question: "What is Bella's price?", answer: "Bella's price is $3,200, including her full veterinary workup and puppy starter pack." },
  ],
  zeus: [
    { question: 'Can Zeus live with other dogs?', answer: 'No, Zeus does best as the only dog so he can bond fully with his family.' },
    { question: 'How big is an XL Bully?', answer: 'XL American Bullies typically stand taller and heavier than Standard Bullies, often 90-100+ lbs at maturity.' },
    { question: 'Is Zeus good with kids?', answer: 'Yes, Zeus is calm and patient with children.' },
    { question: 'Is Zeus neutered?', answer: 'Yes, Zeus is neutered, vaccinated and microchipped.' },
    { question: "What is Zeus's price?", answer: "Zeus's price is $4,000, reflecting his size, health testing and ABKC registration." },
  ],
  nova: [
    { question: 'Is Nova good with training?', answer: 'Yes, Nova is highly trainable and thrives with a job to do.' },
    { question: 'Does Nova get along with cats?', answer: 'Yes, Nova is fully socialized with cats and other dogs.' },
    { question: 'Is Nova spayed?', answer: 'Yes, Nova is spayed, microchipped and fully vaccinated.' },
    { question: 'How much exercise does Nova need?', answer: 'As an athletic APBT, Nova does best with daily active exercise like long walks or play sessions.' },
    { question: "What is Nova's price?", answer: "Nova's price is $1,800, covering her full veterinary preparation." },
  ],
  diesel: [
    { question: 'Is Diesel good for first-time owners?', answer: 'Yes, Diesel is easygoing and social, making him a great choice for a first-time Bully owner.' },
    { question: 'What is a "Classic" Bully?', answer: 'Classic American Bullies have a leaner, more athletic build than Standard or XL Bullies while keeping the same friendly temperament.' },
    { question: 'Is Diesel good with other pets?', answer: 'Yes, Diesel gets along with other dogs and cats.' },
    { question: 'Is Diesel neutered?', answer: 'Yes, Diesel is neutered, vaccinated and microchipped.' },
    { question: "What is Diesel's price?", answer: "Diesel's price is $2,200, including his full health workup." },
  ],
  rosie: [
    { question: 'What is a "Lilac" Bully?', answer: 'Lilac is a rare dilute coat color — a light grey-brown tone caused by a recessive gene combination.' },
    { question: 'Is Rosie good with kids?', answer: 'Yes, Rosie is bold and affectionate with children.' },
    { question: 'Does Rosie get along with cats?', answer: 'Rosie has not been extensively tested with cats and does best in a dog-loving, cat-free home.' },
    { question: 'Is Rosie vaccinated?', answer: 'Yes, Rosie is up to date on puppy vaccinations and microchipped.' },
    { question: "What is Rosie's price?", answer: "Rosie's price is $3,500, reflecting her rare coloring and UKC registration." },
  ],
  titan: [
    { question: 'Why adopt a senior Bully?', answer: 'Senior dogs like Titan are calmer, past the destructive puppy stage, and bond deeply with their new family.' },
    { question: 'What is a "Merle" coat?', answer: 'Merle is a mottled coat pattern with patches of diluted pigment, giving a marbled appearance.' },
    { question: 'Is Titan good with other pets?', answer: 'Titan prefers to be the only pet in the home.' },
    { question: 'Is Titan healthy?', answer: 'Yes, Titan has had a full senior vet exam and is in good health for his age.' },
    { question: "What is Titan's price?", answer: "Titan has a reduced price of $1,500 to help him find a loving home quickly." },
  ],
  sadie: [
    { question: 'Can I still apply for Sadie?', answer: 'No, Sadie has already been placed with her new family.' },
    { question: 'How often do you have Pocket Bully puppies?', answer: 'We typically have Pocket Bully puppies available a few times a year — join our contact list to be notified.' },
    { question: 'Where was Sadie placed?', answer: 'She was placed with a family on the West Coast.' },
  ],
  bruno: [
    { question: "What is Bruno's personality?", answer: 'Bruno is goofy, sturdy and affectionate with the whole family.' },
    { question: 'Is Bruno good with other pets?', answer: 'Yes, Bruno gets along with other dogs and cats.' },
    { question: 'Is Bruno neutered?', answer: 'Yes, Bruno is neutered, vaccinated and microchipped.' },
    { question: "What is Bruno's price?", answer: "Bruno's price is $2,400, covering his full health workup and starter pack." },
  ],
  coco: [
    { question: "What is Coco's personality?", answer: 'Coco is fearless and snuggly, already showing a confident Classic Bully temperament.' },
    { question: 'Is Coco vaccinated?', answer: 'Yes, Coco has had her first round of puppy vaccinations and a full vet check.' },
    { question: 'How big will Coco get?', answer: 'As a Classic Bully, Coco is expected to mature around 12-20 lbs depending on her line.' },
    { question: "What is Coco's price?", answer: "Coco's price is $2,900, including her health workup and starter supplies." },
  ],
};
