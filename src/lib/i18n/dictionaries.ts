
export type Dictionary = {
  header: {
    title: string;
    account: string;
    rewards: string;
    logout: string;
    login: string;
  };
  home: {
    title:string;
    subtitle: string;
    learningButton: string;
    rewardsButton: string;
    settingsButton: string;
    leaderboardButton: string;
  };
  topics: {
    title: string;
    topicNames: Record<string, string>;
    topicDescriptions: Record<string, string>;
    start: string;
  };
  rewards: {
    title: string;
    description: string;
    comingSoon: string;
    backToHome: string;
  };
  leaderboard: {
    title: string;
    description: string;
    comingSoon: string;
    backToHome: string;
  };
  settings: {
    title: string;
    description: string;
    musicLabel: string;
    languageLabel: string;
    languagePlaceholder: string;
    english: string;
    hindi: string;
    bengali: string;
    translationNotice: string;
    backToHome: string;
  };
  login: {
    loginTitle: string;
    loginDescription: string;
    signupTitle: string;
    signupDescription: string;
    emailLabel: string;
    passwordLabel: string;
    firstNameLabel: string;
    lastNameLabel: string;
    confirmPasswordLabel: string;
    loginButton: string;
    signupButton: string;
    errorTitle: string;
  };
  account: {
    title: string;
    logoutButton: string;
    backToHome: string;
  };
  quiz: {
    readyToTest: string;
    generating: string;
    start: string;
    backToTopics: string;
    questionOf: string;
    score: string;
    next: string;
    finish: string;
    tipTitle: string;
    tipDescription: string;
    tipError: string;
    gotIt: string;
    greatJob: string;
    keepTrying: string;
    completed: string;
    yourScore: string;
    playAgain: string;
  };
};

export const dictionaries: Record<string, Dictionary> = {
  en: {
    header: {
      title: 'SmartyKids',
      account: 'Account',
      rewards: 'Rewards',
      logout: 'Log Out',
      login: 'Login',
    },
    home: {
      title: 'SmartyKids',
      subtitle: 'Fun Learning for Nursery!',
      learningButton: 'Start Learning',
      rewardsButton: 'Rewards',
      settingsButton: 'Account',
      leaderboardButton: 'Leaderboard',
    },
    topics: {
      title: 'Choose a topic to learn!',
      topicNames: {
        alphabets: 'Alphabets',
        numbers: 'Numbers',
        colors: 'Colors',
        animals: 'Animals',
        shapes: 'Shapes',
      },
      topicDescriptions: {
        alphabets: 'Learn the ABCs and recognize letters.',
        numbers: 'Count and identify numbers from 1 to 20.',
        colors: 'Discover the wonderful world of colors.',
        animals: 'Meet different animals and learn their names.',
        shapes: 'Identify circles, squares, triangles, and more.',
      },
      start: 'Start',
    },
    rewards: {
      title: 'All Rewards',
      description: 'Unlock amazing rewards as you learn!',
      comingSoon: 'This feature is coming soon. Keep learning to be the first to see your trophies and prizes!',
      backToHome: 'Back to Home',
    },
    leaderboard: {
      title: 'Leaderboard',
      description: 'See who is at the top of the ranks!',
      comingSoon: 'The leaderboard is coming soon. Keep earning points to climb to the top!',
      backToHome: 'Back to Home',
    },
    settings: {
      title: 'Settings',
      description: 'Adjust your app experience here.',
      musicLabel: 'Background Music',
      languageLabel: 'Language',
      languagePlaceholder: 'Select language',
      english: 'English',
      hindi: 'Hindi',
      bengali: 'Bengali',
      translationNotice: 'App content will be translated in a future update.',
      backToHome: 'Back to Home',
    },
    login: {
      loginTitle: 'Login',
      loginDescription: 'Sign in to your account to continue.',
      signupTitle: 'Sign Up',
      signupDescription: 'Create an account to start learning.',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      firstNameLabel: 'First Name',
      lastNameLabel: 'Last Name',
      confirmPasswordLabel: 'Confirm Password',
      loginButton: 'Login',
      signupButton: 'Create Account',
      errorTitle: 'Authentication Error',
    },
    account: {
      title: 'Your Account',
      logoutButton: 'Log Out',
      backToHome: 'Back to Home',
    },
    quiz: {
      readyToTest: 'Ready to test your knowledge?',
      generating: 'Generating Quiz...',
      start: 'Start Quiz!',
      backToTopics: 'Back to Topics',
      questionOf: 'Question {current} of {total}',
      score: 'Score: {score}',
      next: 'Next',
      finish: 'Finish',
      tipTitle: "Here's a little tip!",
      tipDescription: "Don't worry, let's try to understand it better.",
      tipError: "Sorry, I couldn't think of a tip right now. The correct answer is: {answer}",
      gotIt: 'Got it!',
      greatJob: 'Great Job!',
      keepTrying: 'Keep Trying!',
      completed: "You've completed the quiz.",
      yourScore: 'Your Score:',
      playAgain: 'Play Again',
    },
  },
  hi: {
    header: {
      title: 'स्मार्टीकिड्स',
      account: 'अकाउंट',
      rewards: 'पुरस्कार',
      logout: 'लॉग आउट',
      login: 'लॉग इन करें',
    },
    home: {
      title: 'स्मार्टीकिड्स',
      subtitle: 'नर्सरी के लिए मजेदार सीखना!',
      learningButton: 'सीखना शुरू करें',
      rewardsButton: 'पुरस्कार',
      settingsButton: 'अकाउंट',
      leaderboardButton: 'लीडरबोर्ड',
    },
    topics: {
      title: 'सीखने के लिए एक विषय चुनें!',
      topicNames: {
        alphabets: 'अक्षर',
        numbers: 'संख्याएँ',
        colors: 'रंग',
        animals: 'जानवर',
        shapes: 'आकृतियाँ',
      },
      topicDescriptions: {
        alphabets: 'एबीसी सीखें और अक्षरों को पहचानें।',
        numbers: '1 से 20 तक की संख्याएँ गिनें और पहचानें।',
        colors: 'रंगों की अद्भुत दुनिया की खोज करें।',
        animals: 'विभिन्न जानवरों से मिलें और उनके नाम जानें।',
        shapes: 'वृत्त, वर्ग, त्रिभुज, और बहुत कुछ पहचानें।',
      },
      start: 'शुरू करें',
    },
    rewards: {
      title: 'सभी पुरस्कार',
      description: 'जैसे-जैसे आप सीखते हैं, अद्भुत पुरस्कार अनलॉक करें!',
      comingSoon: 'यह सुविधा जल्द ही आ रही है। अपनी ट्राफियां और पुरस्कार सबसे पहले देखने के लिए सीखते रहें!',
      backToHome: 'होम पर वापस जाएं',
    },
    leaderboard: {
      title: 'लीडरबोर्ड',
      description: 'देखें कि रैंक में कौन सबसे ऊपर है!',
      comingSoon: 'लीडरबोर्ड जल्द ही आ रहा है। शीर्ष पर चढ़ने के लिए अंक अर्जित करते रहें!',
      backToHome: 'होम पर वापस जाएं',
    },
    settings: {
      title: 'सेटिंग्स',
      description: 'यहां अपने ऐप अनुभव को समायोजित करें।',
      musicLabel: 'पार्श्व संगीत',
      languageLabel: 'भाषा',
      languagePlaceholder: 'भाषा चुने',
      english: 'English',
      hindi: 'हिंदी',
      bengali: 'বাংলা',
      translationNotice: 'ऐप सामग्री को भविष्य के अपडेट में अनुवादित किया जाएगा।',
      backToHome: 'होम पर वापस जाएं',
    },
    login: {
      loginTitle: 'लॉग इन करें',
      loginDescription: 'जारी रखने के लिए अपने खाते में साइन इन करें।',
      signupTitle: 'साइन अप करें',
      signupDescription: 'सीखना शुरू करने के लिए एक खाता बनाएं।',
      emailLabel: 'ईमेल',
      passwordLabel: 'पासवर्ड',
      firstNameLabel: 'पहला नाम',
      lastNameLabel: 'अंतिम नाम',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि कीजिये',
      loginButton: 'लॉग इन करें',
      signupButton: 'खाता बनाएं',
      errorTitle: 'प्रमाणीकरण त्रुटि',
    },
    account: {
      title: 'आपका खाता',
      logoutButton: 'लॉग आउट',
      backToHome: 'होम पर वापस जाएं',
    },
    quiz: {
      readyToTest: 'क्या आप अपने ज्ञान का परीक्षण करने के लिए तैयार हैं?',
      generating: 'प्रश्नोत्तरी बना रहा है...',
      start: 'प्रश्नोत्तरी शुरू करें!',
      backToTopics: 'विषयों पर वापस जाएं',
      questionOf: 'प्रश्न {current} / {total}',
      score: 'स्कोर: {score}',
      next: 'अगला',
      finish: 'समाप्त',
      tipTitle: 'यहाँ एक छोटी सी युक्ति है!',
      tipDescription: 'चिंता न करें, आइए इसे बेहतर ढंग से समझने की कोशिश करें।',
      tipError: "क्षमा करें, मैं अभी एक युक्ति के बारे में नहीं सोच सका। सही उत्तर है: {answer}",
      gotIt: 'समझ गया!',
      greatJob: 'बहुत बढ़िया!',
      keepTrying: 'कोशिश करते रहो!',
      completed: 'आपने प्रश्नोत्तरी पूरी कर ली है।',
      yourScore: 'आपका स्कोर:',
      playAgain: 'फिर से खेलें',
    },
  },
  bn: {
    header: {
      title: 'স্মার্টিকিডস',
      account: 'অ্যাকাউন্ট',
      rewards: 'পুরস্কার',
      logout: 'লগ আউট',
      login: 'লগ ইন',
    },
    home: {
      title: 'স্মার্টিকিডস',
      subtitle: 'নার্সারির জন্য মজাদার শিক্ষা!',
      learningButton: 'শেখা শুরু করুন',
      rewardsButton: 'পুরস্কার',
      settingsButton: 'অ্যাকাউন্ট',
      leaderboardButton: 'লিডারবোর্ড',
    },
    topics: {
      title: 'শেখার জন্য একটি বিষয় বেছে নিন!',
      topicNames: {
        alphabets: 'বর্ণমালা',
        numbers: 'সংখ্যা',
        colors: 'রঙ',
        animals: 'প্রাণী',
        shapes: 'আকার',
      },
      topicDescriptions: {
        alphabets: 'ABCs শিখুন এবং অক্ষর চিনুন।',
        numbers: '১ থেকে ২০ পর্যন্ত সংখ্যা গণনা করুন এবং সনাক্ত করুন।',
        colors: 'রঙের अद्भुत दुनिया আবিষ্কার করুন।',
        animals: 'বিভিন্ন প্রাণীর সাথে দেখা করুন এবং তাদের নাম শিখুন।',
        shapes: 'বৃত্ত, বর্গক্ষেত্র, ত্রিভুজ এবং আরও অনেক কিছু সনাক্ত করুন।',
      },
      start: 'শুরু করুন',
    },
    rewards: {
      title: 'সমস্ত পুরস্কার',
      description: 'আপনি শিখার সাথে সাথে আশ্চর্যজনক পুরস্কার আনলক করুন!',
      comingSoon: 'এই বৈশিষ্ট্যটি শীঘ্রই আসছে। আপনার ট্রফি এবং পুরস্কার প্রথম দেখতে শিখতে থাকুন!',
      backToHome: 'হোমে ফিরে যান',
    },
    leaderboard: {
      title: 'লিডারবোর্ড',
      description: 'দেখুন কে র‌্যাঙ্কের শীর্ষে আছে!',
      comingSoon: 'লিডারবোর্ড শীঘ্রই আসছে। শীর্ষে আরোহণের জন্য পয়েন্ট অর্জন করতে থাকুন!',
      backToHome: 'হোমে ফিরে যান',
    },
    settings: {
      title: 'সেটিংস',
      description: 'আপনার অ্যাপ অভিজ্ঞতা এখানে সামঞ্জস্য করুন।',
      musicLabel: 'পটভূমি সংগীত',
      languageLabel: 'ভাষা',
      languagePlaceholder: 'ভাষা নির্বাচন করুন',
      english: 'English',
      hindi: 'हिन्दी',
      bengali: 'বাংলা',
      translationNotice: 'অ্যাপের বিষয়বস্তু ভবিষ্যতের আপডেটে অনুবাদ করা হবে।',
      backToHome: 'হোমে ফিরে যান',
    },
    login: {
      loginTitle: 'লগ ইন',
      loginDescription: 'চালিয়ে যেতে আপনার অ্যাকাউন্টে সাইন ইন করুন।',
      signupTitle: 'সাইন আপ',
      signupDescription: 'শেখা শুরু করতে একটি অ্যাকাউন্ট তৈরি করুন।',
      emailLabel: 'ইমেল',
      passwordLabel: 'পাসওয়ার্ড',
      firstNameLabel: 'নামের প্রথম অংশ',
      lastNameLabel: 'নামের শেষাংশ',
      confirmPasswordLabel: 'পাসওয়ার্ড নিশ্চিত করুন',
      loginButton: 'লগ ইন',
      signupButton: 'অ্যাকাউন্ট তৈরি করুন',
      errorTitle: 'প্রমাণীকরণ ত্রুটি',
    },
    account: {
      title: 'আপনার অ্যাকাউন্ট',
      logoutButton: 'লগ আউট',
      backToHome: 'হোমে ফিরে যান',
    },
    quiz: {
      readyToTest: 'আপনি কি আপনার জ্ঞান পরীক্ষা করতে প্রস্তুত?',
      generating: 'কুইজ তৈরি করা হচ্ছে...',
      start: 'কুইজ শুরু করুন!',
      backToTopics: 'বিষয়গুলিতে ফিরে যান',
      questionOf: 'প্রশ্ন {current} এর {total}',
      score: 'স্কোর: {score}',
      next: 'পরবর্তী',
      finish: 'শেষ',
      tipTitle: 'এখানে একটি ছোট টিপ!',
      tipDescription: 'চিন্তা করবেন না, আসুন এটি আরও ভালভাবে বোঝার চেষ্টা করি।',
      tipError: "দুঃখিত, আমি এই মুহূর্তে একটি টিপ ভাবতে পারিনি। সঠিক উত্তর হল: {answer}",
      gotIt: 'পেয়েছি!',
      greatJob: 'দারুণ কাজ!',
      keepTrying: 'চেষ্টা করতে থাকো!',
      completed: 'আপনি কুইজটি সম্পন্ন করেছেন।',
      yourScore: 'আপনার স্কোর:',
      playAgain: 'আবার খেলুন',
    },
  },
};
