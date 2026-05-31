import type { LanguageCourse } from "../types";

export const japaneseCourse: LanguageCourse = {
  language: "japanese",
  flag: "🇯🇵",
  displayName: "Japanese",
  lessons: [
    {
      id: "ja-greetings",
      title: "Greetings",
      description: "Learn how to greet people in Japanese",
      words: [
        { word: "こんにちは", translation: "Hello", pronunciation: "Konnichiwa", example: "こんにちは！お元気ですか？", exampleTranslation: "Hello! How are you?" },
        { word: "おはようございます", translation: "Good morning", pronunciation: "Ohayou gozaimasu", example: "おはようございます、田中さん。", exampleTranslation: "Good morning, Tanaka-san." },
        { word: "こんばんは", translation: "Good evening", pronunciation: "Konbanwa", example: "こんばんは！今日はどうでしたか？", exampleTranslation: "Good evening! How was today?" },
        { word: "さようなら", translation: "Goodbye", pronunciation: "Sayounara", example: "さようなら、またね。", exampleTranslation: "Goodbye, see you again." },
        { word: "ありがとう", translation: "Thank you", pronunciation: "Arigatou", example: "ありがとう、助かりました。", exampleTranslation: "Thank you, that was helpful." },
      ],
      quiz: [
        { question: "What does 'こんにちは' mean?", options: ["Goodbye", "Good morning", "Hello", "Thank you"], correctIndex: 2 },
        { question: "How do you say 'Good morning'?", options: ["こんばんは", "さようなら", "おはようございます", "ありがとう"], correctIndex: 2 },
        { question: "What does 'さようなら' mean?", options: ["Hello", "Goodbye", "Good evening", "Please"], correctIndex: 1 },
        { question: "How do you say 'Thank you'?", options: ["こんにちは", "ありがとう", "おはようございます", "こんばんは"], correctIndex: 1 },
        { question: "What does 'こんばんは' mean?", options: ["Good morning", "Hello", "Thank you", "Good evening"], correctIndex: 3 },
      ],
    },
    {
      id: "ja-numbers",
      title: "Numbers 1–10",
      description: "Count from one to ten in Japanese",
      words: [
        { word: "一", translation: "One", pronunciation: "Ichi" },
        { word: "二", translation: "Two", pronunciation: "Ni" },
        { word: "三", translation: "Three", pronunciation: "San" },
        { word: "四", translation: "Four", pronunciation: "Shi / Yon" },
        { word: "五", translation: "Five", pronunciation: "Go" },
        { word: "六", translation: "Six", pronunciation: "Roku" },
        { word: "七", translation: "Seven", pronunciation: "Shichi / Nana" },
        { word: "八", translation: "Eight", pronunciation: "Hachi" },
        { word: "九", translation: "Nine", pronunciation: "Ku / Kyuu" },
        { word: "十", translation: "Ten", pronunciation: "Juu" },
      ],
      quiz: [
        { question: "What does '三' mean?", options: ["Two", "Four", "Three", "Five"], correctIndex: 2 },
        { question: "How do you say 'Seven'?", options: ["六 (Roku)", "七 (Shichi)", "八 (Hachi)", "九 (Ku)"], correctIndex: 1 },
        { question: "What does '十' mean?", options: ["Eight", "Nine", "Six", "Ten"], correctIndex: 3 },
        { question: "How do you say 'Five'?", options: ["四 (Yon)", "五 (Go)", "六 (Roku)", "三 (San)"], correctIndex: 1 },
        { question: "What does '一' mean?", options: ["Two", "Three", "One", "Four"], correctIndex: 2 },
      ],
    },
    {
      id: "ja-food",
      title: "Food & Drink",
      description: "Learn common food and drink words in Japanese",
      words: [
        { word: "ごはん", translation: "Rice / Meal", pronunciation: "Gohan", example: "ごはんを食べましょう。", exampleTranslation: "Let's eat a meal." },
        { word: "みず", translation: "Water", pronunciation: "Mizu", example: "みずをください。", exampleTranslation: "Please give me water." },
        { word: "おちゃ", translation: "Tea", pronunciation: "Ocha", example: "おちゃが好きです。", exampleTranslation: "I like tea." },
        { word: "すし", translation: "Sushi", pronunciation: "Sushi", example: "すしはおいしいです。", exampleTranslation: "Sushi is delicious." },
        { word: "ラーメン", translation: "Ramen", pronunciation: "Raamen", example: "ラーメンを食べたいです。", exampleTranslation: "I want to eat ramen." },
        { word: "たまご", translation: "Egg", pronunciation: "Tamago", example: "たまごが二つあります。", exampleTranslation: "There are two eggs." },
      ],
      quiz: [
        { question: "What does 'ごはん' mean?", options: ["Tea", "Water", "Rice / Meal", "Egg"], correctIndex: 2 },
        { question: "How do you say 'Water'?", options: ["おちゃ", "ごはん", "みず", "すし"], correctIndex: 2 },
        { question: "What does 'すし' mean?", options: ["Ramen", "Sushi", "Egg", "Tea"], correctIndex: 1 },
        { question: "How do you say 'Tea'?", options: ["みず", "おちゃ", "たまご", "ラーメン"], correctIndex: 1 },
        { question: "What does 'たまご' mean?", options: ["Sushi", "Water", "Rice", "Egg"], correctIndex: 3 },
      ],
    },
  ],
};
