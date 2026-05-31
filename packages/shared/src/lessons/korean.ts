import type { LanguageCourse } from "../types";

export const koreanCourse: LanguageCourse = {
  language: "korean",
  flag: "🇰🇷",
  displayName: "Korean",
  lessons: [
    {
      id: "ko-greetings",
      title: "Greetings",
      description: "Learn how to greet people in Korean",
      words: [
        { word: "안녕하세요", translation: "Hello", pronunciation: "Annyeonghaseyo", example: "안녕하세요! 만나서 반가워요.", exampleTranslation: "Hello! Nice to meet you." },
        { word: "안녕히 가세요", translation: "Goodbye (to someone leaving)", pronunciation: "Annyeonghi gaseyo", example: "안녕히 가세요, 내일 봬요.", exampleTranslation: "Goodbye, see you tomorrow." },
        { word: "감사합니다", translation: "Thank you", pronunciation: "Gamsahamnida", example: "도와줘서 감사합니다.", exampleTranslation: "Thank you for helping me." },
        { word: "죄송합니다", translation: "I'm sorry", pronunciation: "Joesonghamnida", example: "늦어서 죄송합니다.", exampleTranslation: "I'm sorry for being late." },
        { word: "괜찮아요", translation: "It's okay / Are you okay?", pronunciation: "Gwaenchanayo", example: "괜찮아요, 걱정하지 마세요.", exampleTranslation: "It's okay, don't worry." },
      ],
      quiz: [
        { question: "What does '안녕하세요' mean?", options: ["Goodbye", "Thank you", "Hello", "I'm sorry"], correctIndex: 2 },
        { question: "How do you say 'Thank you'?", options: ["괜찮아요", "죄송합니다", "감사합니다", "안녕하세요"], correctIndex: 2 },
        { question: "What does '죄송합니다' mean?", options: ["Hello", "It's okay", "Thank you", "I'm sorry"], correctIndex: 3 },
        { question: "How do you say 'It's okay'?", options: ["감사합니다", "괜찮아요", "안녕하세요", "죄송합니다"], correctIndex: 1 },
        { question: "What does '안녕히 가세요' mean?", options: ["Hello", "Thank you", "Goodbye", "I'm sorry"], correctIndex: 2 },
      ],
    },
    {
      id: "ko-numbers",
      title: "Numbers 1–10",
      description: "Count from one to ten in Korean",
      words: [
        { word: "일", translation: "One", pronunciation: "Il" },
        { word: "이", translation: "Two", pronunciation: "I" },
        { word: "삼", translation: "Three", pronunciation: "Sam" },
        { word: "사", translation: "Four", pronunciation: "Sa" },
        { word: "오", translation: "Five", pronunciation: "O" },
        { word: "육", translation: "Six", pronunciation: "Yuk" },
        { word: "칠", translation: "Seven", pronunciation: "Chil" },
        { word: "팔", translation: "Eight", pronunciation: "Pal" },
        { word: "구", translation: "Nine", pronunciation: "Gu" },
        { word: "십", translation: "Ten", pronunciation: "Sip" },
      ],
      quiz: [
        { question: "What does '삼' mean?", options: ["Two", "Four", "Three", "Five"], correctIndex: 2 },
        { question: "How do you say 'Seven'?", options: ["육 (Yuk)", "칠 (Chil)", "팔 (Pal)", "구 (Gu)"], correctIndex: 1 },
        { question: "What does '십' mean?", options: ["Eight", "Nine", "Six", "Ten"], correctIndex: 3 },
        { question: "How do you say 'Five'?", options: ["사 (Sa)", "오 (O)", "육 (Yuk)", "삼 (Sam)"], correctIndex: 1 },
        { question: "What does '일' mean?", options: ["Two", "Three", "One", "Four"], correctIndex: 2 },
      ],
    },
    {
      id: "ko-food",
      title: "Food & Drink",
      description: "Learn common food and drink words in Korean",
      words: [
        { word: "밥", translation: "Rice / Meal", pronunciation: "Bap", example: "밥 먹었어요?", exampleTranslation: "Have you eaten?" },
        { word: "물", translation: "Water", pronunciation: "Mul", example: "물 한 잔 주세요.", exampleTranslation: "Please give me a glass of water." },
        { word: "김치", translation: "Kimchi", pronunciation: "Kimchi", example: "김치가 맛있어요.", exampleTranslation: "The kimchi is delicious." },
        { word: "불고기", translation: "Bulgogi (grilled beef)", pronunciation: "Bulgogi", example: "불고기를 좋아해요.", exampleTranslation: "I like bulgogi." },
        { word: "커피", translation: "Coffee", pronunciation: "Keopi", example: "커피 한 잔 마실래요?", exampleTranslation: "Would you like a cup of coffee?" },
        { word: "사과", translation: "Apple", pronunciation: "Sagwa", example: "사과가 달아요.", exampleTranslation: "The apple is sweet." },
      ],
      quiz: [
        { question: "What does '밥' mean?", options: ["Coffee", "Water", "Rice / Meal", "Apple"], correctIndex: 2 },
        { question: "How do you say 'Water'?", options: ["커피", "밥", "물", "김치"], correctIndex: 2 },
        { question: "What does '김치' mean?", options: ["Bulgogi", "Kimchi", "Apple", "Coffee"], correctIndex: 1 },
        { question: "How do you say 'Coffee'?", options: ["물", "커피", "사과", "불고기"], correctIndex: 1 },
        { question: "What does '사과' mean?", options: ["Kimchi", "Water", "Rice", "Apple"], correctIndex: 3 },
      ],
    },
  ],
};
