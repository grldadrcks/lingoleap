import type { LanguageCourse } from "../types";

export const frenchCourse: LanguageCourse = {
  language: "french",
  flag: "🇫🇷",
  displayName: "French",
  lessons: [
    {
      id: "fr-greetings",
      title: "Greetings",
      description: "Learn how to greet people in French",
      words: [
        { word: "Bonjour", translation: "Hello / Good day", pronunciation: "bohn-ZHOOR", example: "Bonjour! Comment allez-vous?", exampleTranslation: "Hello! How are you?" },
        { word: "Au revoir", translation: "Goodbye", pronunciation: "oh ruh-VWAHR", example: "Au revoir! À bientôt.", exampleTranslation: "Goodbye! See you soon." },
        { word: "Merci", translation: "Thank you", pronunciation: "mehr-SEE", example: "Merci beaucoup!", exampleTranslation: "Thank you very much!" },
        { word: "S'il vous plaît", translation: "Please", pronunciation: "seel voo PLEH", example: "Un café, s'il vous plaît.", exampleTranslation: "A coffee, please." },
        { word: "Excusez-moi", translation: "Excuse me", pronunciation: "ex-koo-zay MWAH", example: "Excusez-moi, où est la gare?", exampleTranslation: "Excuse me, where is the station?" },
      ],
      quiz: [
        { question: "What does 'Bonjour' mean?", options: ["Goodbye", "Thank you", "Hello", "Please"], correctIndex: 2 },
        { question: "How do you say 'Thank you'?", options: ["Bonjour", "Au revoir", "Merci", "Excusez-moi"], correctIndex: 2 },
        { question: "What does 'Au revoir' mean?", options: ["Hello", "Goodbye", "Please", "Excuse me"], correctIndex: 1 },
        { question: "How do you say 'Please'?", options: ["Merci", "Bonjour", "S'il vous plaît", "Au revoir"], correctIndex: 2 },
        { question: "What does 'Excusez-moi' mean?", options: ["Thank you", "Hello", "Goodbye", "Excuse me"], correctIndex: 3 },
      ],
    },
    {
      id: "fr-numbers",
      title: "Numbers 1–10",
      description: "Count from one to ten in French",
      words: [
        { word: "Un", translation: "One", pronunciation: "uhn" },
        { word: "Deux", translation: "Two", pronunciation: "duh" },
        { word: "Trois", translation: "Three", pronunciation: "twah" },
        { word: "Quatre", translation: "Four", pronunciation: "KAH-truh" },
        { word: "Cinq", translation: "Five", pronunciation: "sank" },
        { word: "Six", translation: "Six", pronunciation: "sees" },
        { word: "Sept", translation: "Seven", pronunciation: "set" },
        { word: "Huit", translation: "Eight", pronunciation: "weet" },
        { word: "Neuf", translation: "Nine", pronunciation: "nuhf" },
        { word: "Dix", translation: "Ten", pronunciation: "dees" },
      ],
      quiz: [
        { question: "What does 'Trois' mean?", options: ["Two", "Four", "Three", "Five"], correctIndex: 2 },
        { question: "How do you say 'Seven'?", options: ["Six", "Sept", "Huit", "Neuf"], correctIndex: 1 },
        { question: "What does 'Dix' mean?", options: ["Eight", "Nine", "Six", "Ten"], correctIndex: 3 },
        { question: "How do you say 'Five'?", options: ["Quatre", "Cinq", "Six", "Trois"], correctIndex: 1 },
        { question: "What does 'Un' mean?", options: ["Two", "Three", "One", "Four"], correctIndex: 2 },
      ],
    },
    {
      id: "fr-food",
      title: "Food & Drink",
      description: "Learn common food and drink words in French",
      words: [
        { word: "Le pain", translation: "Bread", pronunciation: "luh pan", example: "Je voudrais du pain.", exampleTranslation: "I would like some bread." },
        { word: "L'eau", translation: "Water", pronunciation: "loh", example: "Un verre d'eau, s'il vous plaît.", exampleTranslation: "A glass of water, please." },
        { word: "Le café", translation: "Coffee", pronunciation: "luh kah-FAY", example: "Je prends un café.", exampleTranslation: "I'll have a coffee." },
        { word: "Le fromage", translation: "Cheese", pronunciation: "luh froh-MAHZH", example: "Le fromage est délicieux.", exampleTranslation: "The cheese is delicious." },
        { word: "Le vin", translation: "Wine", pronunciation: "luh van", example: "Un verre de vin rouge, s'il vous plaît.", exampleTranslation: "A glass of red wine, please." },
        { word: "La pomme", translation: "Apple", pronunciation: "lah pom", example: "Je mange une pomme.", exampleTranslation: "I am eating an apple." },
      ],
      quiz: [
        { question: "What does 'Le pain' mean?", options: ["Coffee", "Water", "Bread", "Wine"], correctIndex: 2 },
        { question: "How do you say 'Water'?", options: ["Le vin", "Le café", "Le fromage", "L'eau"], correctIndex: 3 },
        { question: "What does 'Le fromage' mean?", options: ["Bread", "Cheese", "Apple", "Wine"], correctIndex: 1 },
        { question: "How do you say 'Coffee'?", options: ["Le pain", "Le café", "La pomme", "L'eau"], correctIndex: 1 },
        { question: "What does 'La pomme' mean?", options: ["Wine", "Cheese", "Water", "Apple"], correctIndex: 3 },
      ],
    },
  ],
};
