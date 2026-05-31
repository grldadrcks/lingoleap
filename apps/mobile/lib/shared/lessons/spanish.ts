import type { LanguageCourse } from "../types";

export const spanishCourse: LanguageCourse = {
  language: "spanish",
  flag: "🇪🇸",
  displayName: "Spanish",
  lessons: [
    {
      id: "es-greetings",
      title: "Greetings",
      description: "Learn how to say hello and goodbye",
      words: [
        { word: "Hola", translation: "Hello", pronunciation: "OH-lah", example: "¡Hola! ¿Cómo estás?", exampleTranslation: "Hello! How are you?" },
        { word: "Adiós", translation: "Goodbye", pronunciation: "ah-DYOS", example: "¡Adiós! Hasta luego.", exampleTranslation: "Goodbye! See you later." },
        { word: "Buenos días", translation: "Good morning", pronunciation: "BWEH-nos DEE-as", example: "Buenos días, señor.", exampleTranslation: "Good morning, sir." },
        { word: "Buenas noches", translation: "Good night", pronunciation: "BWEH-nas NOH-ches", example: "Buenas noches, hasta mañana.", exampleTranslation: "Good night, see you tomorrow." },
        { word: "Por favor", translation: "Please", pronunciation: "por fah-BOR", example: "Un café, por favor.", exampleTranslation: "A coffee, please." },
      ],
      quiz: [
        { question: "What does 'Hola' mean?", options: ["Goodbye", "Hello", "Please", "Thank you"], correctIndex: 1 },
        { question: "How do you say 'Good morning'?", options: ["Buenas noches", "Adiós", "Buenos días", "Hola"], correctIndex: 2 },
        { question: "What does 'Por favor' mean?", options: ["Excuse me", "Thank you", "Sorry", "Please"], correctIndex: 3 },
        { question: "What does 'Adiós' mean?", options: ["Hello", "Good night", "Goodbye", "Good morning"], correctIndex: 2 },
        { question: "How do you say 'Good night'?", options: ["Buenas noches", "Buenos días", "Hola", "Por favor"], correctIndex: 0 },
      ],
    },
    {
      id: "es-numbers",
      title: "Numbers 1–10",
      description: "Count from one to ten in Spanish",
      words: [
        { word: "Uno", translation: "One", pronunciation: "OO-noh" },
        { word: "Dos", translation: "Two", pronunciation: "dohs" },
        { word: "Tres", translation: "Three", pronunciation: "trehs" },
        { word: "Cuatro", translation: "Four", pronunciation: "KWAH-troh" },
        { word: "Cinco", translation: "Five", pronunciation: "SEEN-koh" },
        { word: "Seis", translation: "Six", pronunciation: "says" },
        { word: "Siete", translation: "Seven", pronunciation: "SYEH-teh" },
        { word: "Ocho", translation: "Eight", pronunciation: "OH-choh" },
        { word: "Nueve", translation: "Nine", pronunciation: "NWEH-beh" },
        { word: "Diez", translation: "Ten", pronunciation: "dyehs" },
      ],
      quiz: [
        { question: "What does 'Tres' mean?", options: ["Two", "Four", "Three", "Five"], correctIndex: 2 },
        { question: "How do you say 'Seven'?", options: ["Seis", "Siete", "Ocho", "Nueve"], correctIndex: 1 },
        { question: "What does 'Diez' mean?", options: ["Eight", "Nine", "Six", "Ten"], correctIndex: 3 },
        { question: "How do you say 'Five'?", options: ["Cuatro", "Cinco", "Seis", "Tres"], correctIndex: 1 },
        { question: "What does 'Uno' mean?", options: ["Two", "Three", "One", "Four"], correctIndex: 2 },
      ],
    },
    {
      id: "es-colors",
      title: "Colors",
      description: "Learn the basic colors in Spanish",
      words: [
        { word: "Rojo", translation: "Red", pronunciation: "ROH-hoh", example: "El coche es rojo.", exampleTranslation: "The car is red." },
        { word: "Azul", translation: "Blue", pronunciation: "ah-SOOL", example: "El cielo es azul.", exampleTranslation: "The sky is blue." },
        { word: "Verde", translation: "Green", pronunciation: "BEHR-deh", example: "La hierba es verde.", exampleTranslation: "The grass is green." },
        { word: "Amarillo", translation: "Yellow", pronunciation: "ah-mah-REE-yoh", example: "El sol es amarillo.", exampleTranslation: "The sun is yellow." },
        { word: "Negro", translation: "Black", pronunciation: "NEH-groh", example: "El gato es negro.", exampleTranslation: "The cat is black." },
        { word: "Blanco", translation: "White", pronunciation: "BLAHN-koh", example: "La nieve es blanca.", exampleTranslation: "The snow is white." },
      ],
      quiz: [
        { question: "What does 'Rojo' mean?", options: ["Blue", "Green", "Red", "Yellow"], correctIndex: 2 },
        { question: "How do you say 'Blue'?", options: ["Verde", "Rojo", "Azul", "Negro"], correctIndex: 2 },
        { question: "What does 'Amarillo' mean?", options: ["Green", "Yellow", "White", "Black"], correctIndex: 1 },
        { question: "How do you say 'Green'?", options: ["Blanco", "Azul", "Amarillo", "Verde"], correctIndex: 3 },
        { question: "What does 'Blanco' mean?", options: ["Black", "White", "Red", "Blue"], correctIndex: 1 },
      ],
    },
  ],
};
