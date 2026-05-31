import type { LanguageCourse } from "../types";

export const mandarinCourse: LanguageCourse = {
  language: "mandarin",
  flag: "🇨🇳",
  displayName: "Mandarin",
  lessons: [
    {
      id: "zh-greetings",
      title: "Greetings",
      description: "Learn how to greet people in Mandarin",
      words: [
        { word: "你好", translation: "Hello", pronunciation: "nǐ hǎo", example: "你好！你叫什么名字？", exampleTranslation: "Hello! What is your name?" },
        { word: "再见", translation: "Goodbye", pronunciation: "zài jiàn", example: "再见！明天见。", exampleTranslation: "Goodbye! See you tomorrow." },
        { word: "谢谢", translation: "Thank you", pronunciation: "xiè xiè", example: "谢谢你的帮助。", exampleTranslation: "Thank you for your help." },
        { word: "对不起", translation: "Sorry", pronunciation: "duì bu qǐ", example: "对不起，我迟到了。", exampleTranslation: "Sorry, I am late." },
        { word: "请", translation: "Please", pronunciation: "qǐng", example: "请坐。", exampleTranslation: "Please sit down." },
      ],
      quiz: [
        { question: "What does '你好' mean?", options: ["Goodbye", "Thank you", "Hello", "Sorry"], correctIndex: 2 },
        { question: "How do you say 'Thank you'?", options: ["请", "再见", "对不起", "谢谢"], correctIndex: 3 },
        { question: "What does '再见' mean?", options: ["Hello", "Goodbye", "Please", "Sorry"], correctIndex: 1 },
        { question: "How do you say 'Sorry'?", options: ["谢谢", "你好", "对不起", "请"], correctIndex: 2 },
        { question: "What does '请' mean?", options: ["Thank you", "Hello", "Goodbye", "Please"], correctIndex: 3 },
      ],
    },
    {
      id: "zh-numbers",
      title: "Numbers 1–10",
      description: "Count from one to ten in Mandarin",
      words: [
        { word: "一", translation: "One", pronunciation: "yī" },
        { word: "二", translation: "Two", pronunciation: "èr" },
        { word: "三", translation: "Three", pronunciation: "sān" },
        { word: "四", translation: "Four", pronunciation: "sì" },
        { word: "五", translation: "Five", pronunciation: "wǔ" },
        { word: "六", translation: "Six", pronunciation: "liù" },
        { word: "七", translation: "Seven", pronunciation: "qī" },
        { word: "八", translation: "Eight", pronunciation: "bā" },
        { word: "九", translation: "Nine", pronunciation: "jiǔ" },
        { word: "十", translation: "Ten", pronunciation: "shí" },
      ],
      quiz: [
        { question: "What does '三' mean?", options: ["Two", "Four", "Three", "Five"], correctIndex: 2 },
        { question: "How do you say 'Seven'?", options: ["六", "七", "八", "九"], correctIndex: 1 },
        { question: "What does '十' mean?", options: ["Eight", "Nine", "Six", "Ten"], correctIndex: 3 },
        { question: "How do you say 'Five'?", options: ["四", "五", "六", "三"], correctIndex: 1 },
        { question: "What does '一' mean?", options: ["Two", "Three", "One", "Four"], correctIndex: 2 },
      ],
    },
    {
      id: "zh-family",
      title: "Family",
      description: "Learn family member words in Mandarin",
      words: [
        { word: "妈妈", translation: "Mom", pronunciation: "māmā", example: "我的妈妈很漂亮。", exampleTranslation: "My mom is beautiful." },
        { word: "爸爸", translation: "Dad", pronunciation: "bàba", example: "爸爸在工作。", exampleTranslation: "Dad is working." },
        { word: "哥哥", translation: "Older brother", pronunciation: "gēgē", example: "我哥哥很高。", exampleTranslation: "My older brother is tall." },
        { word: "姐姐", translation: "Older sister", pronunciation: "jiějie", example: "姐姐在学校。", exampleTranslation: "Older sister is at school." },
        { word: "弟弟", translation: "Younger brother", pronunciation: "dìdi", example: "弟弟很可爱。", exampleTranslation: "Younger brother is cute." },
        { word: "妹妹", translation: "Younger sister", pronunciation: "mèimei", example: "妹妹喜欢唱歌。", exampleTranslation: "Younger sister likes to sing." },
      ],
      quiz: [
        { question: "What does '妈妈' mean?", options: ["Dad", "Mom", "Sister", "Brother"], correctIndex: 1 },
        { question: "How do you say 'Older brother'?", options: ["弟弟", "爸爸", "哥哥", "姐姐"], correctIndex: 2 },
        { question: "What does '妹妹' mean?", options: ["Older sister", "Mom", "Younger sister", "Dad"], correctIndex: 2 },
        { question: "How do you say 'Dad'?", options: ["妈妈", "爸爸", "哥哥", "弟弟"], correctIndex: 1 },
        { question: "What does '姐姐' mean?", options: ["Younger sister", "Mom", "Younger brother", "Older sister"], correctIndex: 3 },
      ],
    },
  ],
};
