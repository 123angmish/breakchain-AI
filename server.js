const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

process.on('uncaughtException', (err) => {
  console.error('Server UncaughtException:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Server UnhandledRejection:', reason);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// ==========================================
// REAL AI INFERENCE HELPER (WITH RESILIENT FALLBACK)
// ==========================================
async function callOnlineLLM(systemPrompt, userPrompt, temperature = 0.7) {
  try {
    const promptCombined = `${systemPrompt}\n\nUser: ${userPrompt}\n\nEmpathetic Assistant:`;
    const encodedPrompt = encodeURIComponent(promptCombined);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try { controller.abort(); } catch(e){}
    }, 4500);

    const res = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&json=false`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'BreakChainAI/2.0' }
    });
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 10 && !text.includes("Error:") && !text.includes("504 Gateway")) {
        return text.trim();
      }
    }
  } catch (err) {
    // Graceful fallback to local counselor engine
  }
  return null;
}

// ==========================================
// 1. SOULBOT AI CHATBOT ENGINE
// ==========================================
function localEmpatheticSoulBot(userMsg, history = []) {
  const text = userMsg.toLowerCase();

  // Crisis detection
  if (text.includes("kill myself") || text.includes("end my life") || text.includes("suicide") || text.includes("marna chahta") || text.includes("mar jau") || text.includes("harm myself")) {
    return {
      reply: "🚨 **You are not alone, and your life has immense value.** Please pause and breathe with me. What you are feeling right now is unbearable pain, but this pain is temporary, and there is help available right now:\n\n📞 **India Crisis Helplines:**\n• **Tele-MANAS:** 14416 / 1800-891-4416 (24/7 Free Govt Helpline)\n• **KIRAN:** 1800-599-0019\n• **Vandrevala Foundation:** +91 9999 666 555\n• **AASRA:** +91 98204 66726\n• **US/Global:** 988 (Suicide & Crisis Lifeline)\n\nPlease reach out to a trusted friend, family member, or call these numbers immediately. I am staying right here with you. Can you take 3 deep breaths with me?",
      emotion: "crisis",
      isCrisis: true
    };
  }

  // Missing Ex / Urge to text
  if (text.includes("miss") || text.includes("call him") || text.includes("call her") || text.includes("text him") || text.includes("text her") || text.includes("yaad aa rahi") || text.includes("message kar doon") || text.includes("msg karu") || text.includes("uski yaad")) {
    const responses = [
      "I hear how much your heart is aching right now. Missing someone doesn't mean they belong in your future—it just means you loved genuinely. Before texting them, ask yourself: *'Am I looking for them, or am I looking for relief from this feeling?'* Texting usually re-opens the wound. Let's write down what you want to say in your Voice Diary instead.",
      "It is completely natural to miss the warmth and routine you shared. But remember why things ended. Calling them right now might give 5 minutes of familiar comfort followed by days of regret and setback. Stay strong. I'm right here with you. What was the exact memory that triggered this urge?",
      "Take a slow, deep breath. The urge to text is just an emotional spike trying to escape discomfort. Give yourself a 15-minute pause rule. In these 15 minutes, drink a glass of cold water and talk to me. If you still feel like texting after, we will draft an unsent closure note together."
    ];
    return {
      reply: responses[Math.floor(Math.random() * responses.length)],
      emotion: "longing",
      exercise: "15-Minute Urge Surfing Rule"
    };
  }

  // Betrayal / Cheating / Anger
  if (text.includes("cheat") || text.includes("dhokha") || text.includes("betray") || text.includes("hate") || text.includes("angry") || text.includes("gussa") || text.includes("lied") || text.includes("jhooth")) {
    const responses = [
      "Your anger and betrayal are 100% valid. When someone violates your trust, it feels like the ground under you was ripped away. Remember: their cheating or dishonesty was a reflection of *their* lack of integrity, never your worth. You did not deserve to be lied to. Let that anger fuel your self-respect, not your self-destruction.",
      "It is okay to feel furious. Anger is your heart's defense mechanism telling you that you deserved better treatment. Don't suppress it—channel it. Have you tried our 'Smash The Plate' catharsis game or writing an unfiltered rage letter in the Diary?",
      "Betrayal cuts deep because you gave someone the power to hurt you. But please remember: their inability to appreciate your loyalty is their lifelong loss, not yours. You are clean in your conscience. Let's protect your peace today."
    ];
    return {
      reply: responses[Math.floor(Math.random() * responses.length)],
      emotion: "betrayal_anger",
      exercise: "Cathartic Release & Plate Smash"
    };
  }

  // Feeling unworthy / Blaming self
  if (text.includes("my fault") || text.includes("meri galti") || text.includes("not good enough") || text.includes("ugly") || text.includes("unlovable") || text.includes("kya kami thi") || text.includes("why me")) {
    const responses = [
      "Please listen to me carefully: You are NOT unlovable, and you are NOT 'not good enough'. When a relationship ends, our mind tortures us with 'what ifs' and self-blame. But a relationship takes two people. Their choice to walk away or mistreat you does not define your infinite worth.",
      "Stop looking for flaws in yourself to justify someone else's inability to love you right. You poured real love, effort, and care. That makes you brave, not inadequate. You will heal, and one day someone will cherish the exact qualities they overlooked.",
      "Self-blame is your brain's illusion trying to regain control over a painful reality. Forgive yourself for loving with your whole heart. Loving deeply is a strength, never a weakness."
    ];
    return {
      reply: responses[Math.floor(Math.random() * responses.length)],
      emotion: "self_blame",
      exercise: "Self-Compassion Affirmation"
    };
  }

  // Anxiety / Overthinking / Panic / Loneliness
  if (text.includes("anxious") || text.includes("panic") || text.includes("scared") || text.includes("lonely") || text.includes("overthink") || text.includes("akela") || text.includes("darr") || text.includes("neend nahi")) {
    const responses = [
      "You are safe right now in this exact moment. Put both feet flat on the floor. Feel the ground beneath you. Inhale for 4 seconds... hold for 4 seconds... and exhale slowly for 6 seconds. You don't have to figure out your entire future today. Just get through today.",
      "Loneliness after a breakup is like emotional phantom limb syndrome—you feel the absence of what was constantly there. But being alone is your sacred sanctuary to rebuild yourself. What is one small comfort you can give yourself right now—a warm drink, a blanket, or your favorite song?",
      "Overthinking is your mind trying to solve emotional pain with logic. But feelings need to be felt, not solved. Let's do a grounding check: Name 3 things you can see around you right now."
    ];
    return {
      reply: responses[Math.floor(Math.random() * responses.length)],
      emotion: "anxiety",
      exercise: "4-7-8 Guided Breathing"
    };
  }

  // Hinglish generic support
  if (text.includes("kya karu") || text.includes("kaise move on") || text.includes("dard ho raha") || text.includes("bohot ro") || text.includes("help") || text.includes("kya kare")) {
    return {
      reply: "Main samajh sakta hoon ki is waqt dil kitna bhaari hai. Breakup ka dard physical injury jaisa hi hota hai. Tumhe abhi sab kuch theek nahi karna hai—bas ek ek din, ek ek ghanta nikalna hai.\n\nKuch baatein hamesha yaad rakhna:\n1. Rona aaye toh khulke ro lo, aansu rokna mat.\n2. Ex ki profile stalk mat karo, no-contact rule follow karo.\n3. Khana aur paani mat chhoro.\n\nMai har pal tumhare saath hoon. Batao sabse zyada kya pareshan kar raha hai?",
      emotion: "supportive_hinglish"
    };
  }

  // Default empathetic response
  const generalEmpathetic = [
    "I am listening with an open heart. Breakup recovery is not a straight line—some days you feel peaceful, other days the wave hits again. Tell me more about what's on your mind right now.",
    "Thank you for sharing that with me. It takes real courage to sit with your emotions instead of running away from them. I'm here to support you every step of the way.",
    "Every tear you shed is your body releasing what no longer serves your future. You are growing stronger even when you feel at your weakest. What would make you feel 1% lighter right now?"
  ];
  return {
    reply: generalEmpathetic[Math.floor(Math.random() * generalEmpathetic.length)],
    emotion: "empathetic_neutral"
  };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], mood = 'neutral' } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Try online AI first
    const systemPrompt = `You are SoulBot, a warm, highly empathetic, emotionally intelligent mental health counselor & heartbreak recovery assistant on BreakChain AI. 
Provide soothing, compassionate, psychologically sound, and practical advice for someone healing from a breakup. 
Keep your response supportive, engaging, and human-like (2-4 paragraphs max). If the user speaks in Hinglish or Hindi, respond warmly in natural Hinglish/Hindi. If they express crisis or self-harm, offer gentle support and mention crisis resources.`;

    try {
      const onlineReply = await callOnlineLLM(systemPrompt, message);
      if (onlineReply) {
        return res.json({
          reply: onlineReply,
          source: 'ai_cloud',
          timestamp: new Date().toISOString()
        });
      }
    } catch(e){}

    // Fallback to local intelligent counseling engine
    const localResult = localEmpatheticSoulBot(message, history);
    res.json({
      reply: localResult.reply,
      emotion: localResult.emotion,
      isCrisis: localResult.isCrisis || false,
      exercise: localResult.exercise || null,
      source: 'counseling_engine',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

// ==========================================
// 2. REAL CHAT AUTOPSY NLP ENGINE
// ==========================================
function performChatAutopsyNLP(chatText) {
  const lines = chatText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const totalLines = lines.length;

  let gaslightingCount = 0;
  let blameShiftCount = 0;
  let manipulationCount = 0;
  let silentTreatmentCount = 0;
  let invalidationCount = 0;
  let healthyCount = 0;

  const flaggedMessages = [];
  const senderStats = {};

  const gaslightingPatterns = [
    /you('?re| are) (crazy|insane|overreacting|imagining|paranoid|dramatic)/i,
    /(i never said that|you always twist|it was just a joke|you have trust issues)/i,
    /(tum pagal ho|dimag kharab hai|tum overreact kar rahe|aisa kuch nahi tha)/i,
    /(you made me do this|you pushed me to)/i
  ];

  const blameShiftPatterns = [
    /(if you (didn't|hadn't|were)|because of you|you forced me|it's all your fault)/i,
    /(meri galti nahi thi|tumhari wajah se|tumne majboor kiya)/i,
    /(look what you made me|you ruined everything)/i
  ];

  const manipulationPatterns = [
    /(if you really loved me|nobody else will love you|you'll never find someone like me)/i,
    /(agar tum mujhse pyaar karte|tumhe koi aur nahi jhelega|mere bina kuch nahi ho)/i,
    /(you owe me|after everything i did for you|threatening to)/i
  ];

  const silentTreatmentPatterns = [
    /(whatever|k|fine.|idc|i don't care|don't talk to me|bye forever|seen)/i,
    /(hath mat lagao|baat mat karo|block kar raha|khatam sab)/i
  ];

  const invalidationPatterns = [
    /(stop crying|get over it|it's not a big deal|you cry for everything)/i,
    /(rona band karo|drame mat karo|choti choti baat pe)/i
  ];

  const healthyPatterns = [
    /(i understand|sorry|i hear you|let's talk|i value you|thank you|how do you feel|i'm here)/i,
    /(samajh sakta hoon|sorry|baat karte hain|shukriya)/i
  ];

  lines.forEach((line, idx) => {
    let parsedSender = "Unknown";
    let messageContent = line;

    // Detect WhatsApp format
    const waMatch = line.match(/^\[?\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?\]?\s*-?\s*([^:]+):\s*(.+)$/i);
    if (waMatch) {
      parsedSender = waMatch[1].trim();
      messageContent = waMatch[2].trim();
    } else {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0 && colonIndex < 30) {
        parsedSender = line.substring(0, colonIndex).trim();
        messageContent = line.substring(colonIndex + 1).trim();
      }
    }

    if (!senderStats[parsedSender]) {
      senderStats[parsedSender] = { count: 0, wordCount: 0, flags: 0 };
    }
    senderStats[parsedSender].count++;
    senderStats[parsedSender].wordCount += messageContent.split(/\s+/).length;

    let flag = null;
    let severity = "low";
    let explanation = "";

    if (gaslightingPatterns.some(p => p.test(messageContent))) {
      gaslightingCount++;
      flag = "Gaslighting";
      severity = "high";
      explanation = "Denying reality, calling you crazy/overreacting to evade accountability.";
    } else if (blameShiftPatterns.some(p => p.test(messageContent))) {
      blameShiftCount++;
      flag = "Blame Shifting";
      severity = "high";
      explanation = "Transferring fault onto you rather than taking ownership of their actions.";
    } else if (manipulationPatterns.some(p => p.test(messageContent))) {
      manipulationCount++;
      flag = "Emotional Manipulation";
      severity = "critical";
      explanation = "Using guilt, conditional love, or threats to control emotional leverage.";
    } else if (silentTreatmentPatterns.some(p => p.test(messageContent))) {
      silentTreatmentCount++;
      flag = "Stonewalling / Cold Shoulder";
      severity = "medium";
      explanation = "Shutting down communication abruptly as a punitive tactic.";
    } else if (invalidationPatterns.some(p => p.test(messageContent))) {
      invalidationCount++;
      flag = "Emotional Invalidation";
      severity = "medium";
      explanation = "Dismissing your genuine emotional hurt as drama or weakness.";
    } else if (healthyPatterns.some(p => p.test(messageContent))) {
      healthyCount++;
    }

    if (flag) {
      senderStats[parsedSender].flags++;
      flaggedMessages.push({
        lineIndex: idx + 1,
        sender: parsedSender,
        message: messageContent,
        fullLine: line,
        flag,
        severity,
        explanation
      });
    }
  });

  const totalFlags = gaslightingCount + blameShiftCount + manipulationCount + silentTreatmentCount + invalidationCount;
  
  // Toxicity score out of 100
  let calculatedToxicity = Math.min(98, Math.round((totalFlags / Math.max(lines.length * 0.15, 1)) * 50 + (manipulationCount * 8) + (gaslightingCount * 6)));
  if (lines.length > 5 && totalFlags === 0) calculatedToxicity = 12;
  if (calculatedToxicity < 15 && totalFlags > 0) calculatedToxicity = 28;

  const communicationHealth = Math.max(5, 100 - calculatedToxicity);
  const empathyScore = Math.max(8, Math.min(95, Math.round((healthyCount / Math.max(lines.length * 0.1, 1)) * 60 + 20)));

  // Determine overall diagnosis
  let diagnosis = "Mild Communication Strains";
  let diagnosisSummary = "The conversation exhibits occasional misunderstandings, but low severe toxic aggression.";
  if (calculatedToxicity >= 65) {
    diagnosis = "Severe Toxic & Manipulative Dynamic";
    diagnosisSummary = "High frequency of gaslighting, guilt-tripping, and accountability avoidance. This is an unhealthy emotional cycle.";
  } else if (calculatedToxicity >= 40) {
    diagnosis = "Unbalanced & Emotionally Draining Dynamic";
    diagnosisSummary = "Frequent invalidation and blame-shifting present. Communication was heavily one-sided and emotionally taxing.";
  }

  return {
    totalMessages: lines.length,
    flaggedCount: totalFlags,
    toxicityScore: calculatedToxicity,
    communicationHealth,
    empathyScore,
    diagnosis,
    diagnosisSummary,
    metrics: {
      gaslighting: gaslightingCount,
      blameShifting: blameShiftCount,
      manipulation: manipulationCount,
      stonewalling: silentTreatmentCount,
      invalidation: invalidationCount,
      healthyExchanges: healthyCount
    },
    senderBreakdown: senderStats,
    flaggedMessages: flaggedMessages.slice(0, 30),
    healingTakeaway: calculatedToxicity > 50
      ? "You are not crazy for feeling exhausted. The chat proves you were dealing with psychological deflection. Walking away was self-preservation."
      : "Closure doesn't require their agreement. You have your clarity right here."
  };
}

app.post('/api/autopsy', async (req, res) => {
  try {
    const { chatText } = req.body;
    if (!chatText || chatText.trim().length < 5) {
      return res.status(400).json({ error: "Please provide valid chat text or upload a chat file." });
    }

    const nlpResult = performChatAutopsyNLP(chatText);
    res.json(nlpResult);
  } catch (err) {
    console.error("Autopsy API error:", err);
    res.status(500).json({ error: "Failed to analyze chat" });
  }
});

// ==========================================
// 3. AI CLOSURE GENERATOR ENGINE
// ==========================================
app.post('/api/closure', async (req, res) => {
  try {
    const { exName = "You", duration = "a long time", reason = "drifting apart", tone = "peaceful", customThoughts = "" } = req.body;

    const tonePrompts = {
      peaceful: "Gentle, graceful, forgiving, accepting that paths must diverge, with deep dignity.",
      firm: "Unambiguous, strong boundaries, no contact, ending false hopes firmly but respectfully.",
      empowered: "Focused on self-worth, rebirth, loving oneself more, reclaiming personal joy and power.",
      unsent: "Deeply cathartic, heartfelt raw emotional release intended for closure without needing to send.",
      gratitude: "Honoring what was learned, thanking for the good memories, but formally letting go."
    };

    const selectedToneDesc = tonePrompts[tone] || tonePrompts.peaceful;

    try {
      const systemPrompt = `You are an empathetic breakup specialist AI. Write a personalized, emotionally resonant Closure Letter and a memorable 1-2 sentence Closure Statement.
Parameters:
- Recipient: ${exName}
- Relationship Duration: ${duration}
- Reason for Breakup: ${reason}
- User's Raw Thoughts: ${customThoughts || 'None provided'}
- Desired Tone: ${selectedToneDesc}

Return in this exact format:
[ONE_LINER]
"Your short powerful closure quote here."

[LETTER]
Dear ${exName},
(Your full, deeply moving 2-3 paragraph closure letter here)
With peace,
(A healed soul)`;

      const onlineClosure = await callOnlineLLM(systemPrompt, `Generate closure letter for ${exName}`);
      if (onlineClosure) {
        let oneLiner = "I release the past with grace, choosing my peace and self-respect above all.";
        let letter = onlineClosure;

        const oneLinerMatch = onlineClosure.match(/\[ONE_LINER\]\s*([\s\S]*?)(?=\[LETTER\]|$)/i);
        const letterMatch = onlineClosure.match(/\[LETTER\]\s*([\s\S]*)/i);

        if (oneLinerMatch && oneLinerMatch[1]) oneLiner = oneLinerMatch[1].trim().replace(/^["']|["']$/g, '');
        if (letterMatch && letterMatch[1]) letter = letterMatch[1].trim();

        return res.json({ oneLiner, letter, tone });
      }
    } catch(e){}

    // Fallback template library
    const fallbackLetters = {
      peaceful: {
        oneLiner: "I'm letting you go, not because I stopped caring, but because I choose peace over pain.",
        letter: `Dear ${exName},\n\nLooking back at our ${duration} together, I know we shared moments that were genuine. But we have reached a point where holding on hurts more than letting go. I forgive you for the misunderstandings and the pain of ${reason}, and I also forgive myself.\n\nI release all bitterness, resentment, and unanswered questions. Our chapter ends here, not with hatred, but with acceptance. I genuinely wish you well in life, and I am choosing to step forward into my own peace.\n\nGoodbye, and take care.`
      },
      firm: {
        oneLiner: "You were a chapter in my life, not the entire story. I am closing this book forever.",
        letter: `Dear ${exName},\n\nI am writing this to establish finality and peace of mind. What happened between us regarding ${reason} made it clear that our values and paths no longer align. I will no longer participate in cycles of confusion, second chances, or emotional drain.\n\nPlease respect my decision for strict no-contact. I need this boundary to protect my well-being. I wish you no harm, but our chapter is permanently closed.\n\nRespectfully.`
      },
      empowered: {
        oneLiner: "I survived the heartbreak, broke the chains, and found my own light again.",
        letter: `Dear ${exName},\n\nFor a long time, I thought losing you would break me. But this heartbreak became the mirror that showed me my own strength. You walked away from someone who loved you unconditionally, while I only lost someone who didn't appreciate me.\n\nI am taking all the love and energy I gave to you and pouring it back into my own dreams and soul. Thank you for the lesson—I am stronger, wiser, and completely free.\n\nWith self-love and dignity.`
      },
      unsent: {
        oneLiner: "I loved you with all I had. I release this pain into the universe and set myself free.",
        letter: `Dear ${exName},\n\nThere were so many things I never got to say when ${reason} tore us apart. I wanted an apology, I wanted closure, I wanted you to understand how much you hurt me. But waiting for closure from you is just waiting in a prison.\n\nSo I am giving myself the closure you couldn't give. I acknowledge the love we had, I acknowledge the heartbreak, and now I lay this heavy burden down. You don't get to occupy my headspace anymore. I am free.\n\nSincerely.`
      },
      gratitude: {
        oneLiner: "Thank you for the memories and the growth. I release you with gratitude.",
        letter: `Dear ${exName},\n\nEven though things didn't work out as we once hoped, I want to thank you for the ${duration} we shared. The laughs, the conversations, and even the difficulties taught me so much about who I am and what I truly value in life.\n\nI carry forward only the wisdom and gratitude. I let go of everything else. May you find happiness and fulfillment on your journey.\n\nWarm regards.`
      }
    };

    const selected = fallbackLetters[tone] || fallbackLetters.peaceful;
    res.json({
      oneLiner: selected.oneLiner,
      letter: selected.letter,
      tone
    });
  } catch (err) {
    console.error("Closure API error:", err);
    res.status(500).json({ error: "Failed to generate closure" });
  }
});

// ==========================================
// 4. AI DIARY EMOTIONAL REFLECTION ENGINE
// ==========================================
app.post('/api/diary-reflect', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
      const systemPrompt = `You are an empathetic psychology counselor AI. Read this personal diary entry written by a heartbroken person.
Diary Entry: "${text}"

Provide a structured psychological feedback in JSON format:
{
  "dominantEmotion": "e.g. Grief / Resentment / Hope / Vulnerability / Loneliness",
  "emotionalIntensity": "Score from 1 to 10",
  "counselorReflection": "2-3 empathetic sentences analyzing their heart and validating them",
  "healingAffirmation": "One powerful 1-sentence healing mantra for today",
  "suggestedAction": "One micro-exercise (e.g. 5-minute walk, cold water face splash, write 3 gratitudes)"
}`;

      const onlineAI = await callOnlineLLM(systemPrompt, text);
      if (onlineAI) {
        const jsonMatch = onlineAI.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        }
      }
    } catch(e){}

    // Local sentiment fallback
    const lower = text.toLowerCase();
    let emotion = "Processing Emotions";
    let intensity = 6;
    let reflection = "Writing this down is a vital step in clearing emotional toxins from your mind. Your feelings are completely natural.";
    let affirmation = "I allow myself to feel, and I trust that this storm will pass.";
    let action = "Take 5 deep belly breaths and drink a tall glass of cool water.";

    if (lower.includes("miss") || lower.includes("cry") || lower.includes("alone") || lower.includes("sad")) {
      emotion = "Grief & Loneliness";
      intensity = 8;
      reflection = "You are carrying a deep yearning for what was familiar. Acknowledge the sadness without judging yourself for it.";
      affirmation = "My heart is healing even on the days I cry.";
      action = "Wrap yourself in a warm blanket and do 3 minutes of box breathing.";
    } else if (lower.includes("angry") || lower.includes("hate") || lower.includes("cheat") || lower.includes("gussa")) {
      emotion = "Anger & Betrayal";
      intensity = 9;
      reflection = "Your anger is protecting your self-worth. Use it as fuel to establish strong boundaries for your future.";
      affirmation = "I reclaim my peace and refuse to let anger consume my present.";
      action = "Try our 'Smash The Plate' game or take a brisk 10-minute walk.";
    } else if (lower.includes("hope") || lower.includes("better") || lower.includes("smile") || lower.includes("peace")) {
      emotion = "Rebirth & Acceptance";
      intensity = 4;
      reflection = "You are beginning to see the light at the end of the tunnel. Celebrate this breakthrough in your emotional resilience.";
      affirmation = "I am ready for the beautiful new chapter waiting for me.";
      action = "Treat yourself to your favorite tea or a relaxing playlist.";
    }

    res.json({
      dominantEmotion: emotion,
      emotionalIntensity: intensity,
      counselorReflection: reflection,
      healingAffirmation: affirmation,
      suggestedAction: action
    });
  } catch (err) {
    console.error("Diary reflect error:", err);
    res.status(500).json({ error: "Failed to reflect on diary" });
  }
});

// ==========================================
// 5. AI RECOVERY ROADMAP GENERATOR
// ==========================================
app.post('/api/roadmap', async (req, res) => {
  try {
    const { type = "General", duration = "6 months", attachment = "Deep", goal = "Move on" } = req.body;

    const stages = [
      {
        phase: "Phase 1: Emotional First Aid & Detox",
        days: "Days 1 – 14",
        objective: "Survive the shock wave, purge emotional toxins, and establish strict No-Contact.",
        tasks: [
          "Establish absolute No-Contact (unfollow, mute triggers, archive chats)",
          "Allow yourself to cry without time limits or guilt",
          "Stay hydrated and maintain basic sleep schedule",
          "Vent unfiltered feelings in the Voice Diary",
          "Play stress-relief games (Bubble Popper / Smash The Plate) during trigger spikes"
        ]
      },
      {
        phase: "Phase 2: Cognitive Reframing & Grief Processing",
        days: "Days 15 – 35",
        objective: "Understand what went wrong, dismantle self-blame, and see reality over fantasy.",
        tasks: [
          "Run Chat Autopsy to understand manipulation patterns and break romanticized illusions",
          "Write an unsent closure letter using the Closure Generator",
          "Begin daily 10-minute morning walks or light stretching",
          "Reach out to 1 trusted friend or counselor when loneliness peaks",
          "Practice 4-7-8 breathing whenever a memory flash occurs"
        ]
      },
      {
        phase: "Phase 3: Identity Reconstruction & Self-Love",
        days: "Days 36 – 70",
        objective: "Rediscover who you are outside of the relationship and rebuild self-worth.",
        tasks: [
          "Pick up an old hobby or creative project you paused during the relationship",
          "Upgrade your physical space (rearrange room, donate ex's gifts)",
          "Lock painful photos in the Secret Vault or perform the Burning Ceremony",
          "Celebrate weekly healing milestones on the Recovery Tracker",
          "Practice daily self-compassion affirmations"
        ]
      },
      {
        phase: "Phase 4: Emotional Freedom & Rebirth",
        days: "Days 71 – 100+",
        objective: "Achieve genuine emotional neutrality, peace, and readiness for future love.",
        tasks: [
          "Take the 'Ready Again' Healing Readiness Assessment",
          "Reflect on the wisdom and strength you gained through this adversity",
          "Set 3 exciting personal goals for the upcoming year",
          "Feel grateful for your own courage and resilience",
          "Claim your BreakChain Healing Champion Badge 🏆"
        ]
      }
    ];

    res.json({
      breakupType: type,
      relationshipDuration: duration,
      recoveryGoal: goal,
      estimatedTimelineDays: duration.includes("year") ? 90 : 60,
      phases: stages
    });
  } catch (err) {
    console.error("Roadmap API error:", err);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

// ==========================================
// 6. HABIT & URGE RESCUE ASSISTANT
// ==========================================
app.post('/api/habit-rescue', (req, res) => {
  const { habit = "Smoking", trigger = "" } = req.body;

  const responses = {
    Smoking: {
      title: "🚭 Cigarette Craving SOS",
      talkDown: "Cigarettes cannot burn away heartbreak—they only burn your lungs and keep you stuck in a loop. The craving you feel right now will peak in 3 minutes and then fade. Don't trade your physical health for a temporary illusion of calm.",
      grounding: "Take 5 deep breaths through your nose, exhaling twice as slow through your mouth. Drink a glass of cold ice water.",
      mantra: "I am stronger than a 3-minute chemical urge. I choose my body."
    },
    Alcohol: {
      title: "🍷 Alcohol Urge SOS",
      talkDown: "Alcohol is a depressant. It feels like an escape for 30 minutes, but tomorrow morning the grief and anxiety will return amplified 10x with hangover regret. Stay in control of your senses tonight.",
      grounding: "Splash cold water on your face right now. Put on upbeat or peaceful acoustic music and hold an ice cube in your hand.",
      mantra: "Numbing my pain will not heal it. I choose clarity."
    },
    Drugs: {
      title: "💊 Substance Impulse SOS",
      talkDown: "You have fought too hard to surrender your power to a chemical. This urge is your hurt brain crying for love—give it self-love, not toxicity. Call someone or talk to SoulBot right now.",
      grounding: "5-4-3-2-1 Sensory Grounding: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.",
      mantra: "My future is worth fighting for. I will not break myself."
    },
    "Self-Harm": {
      title: "❤️ Immediate Love & Protection SOS",
      talkDown: "Please stop and hear me: You do NOT deserve pain. Your body is doing its best to carry you through unbearable grief. Hurting yourself will not fix the breakup. You deserve tenderness, warmth, and protection.",
      grounding: "Hold an ice cube tightly in your hand until it melts, or snap a soft rubber band on your wrist. Wrap yourself tightly in a blanket and call 14416 / 988 immediately.",
      mantra: "I am worthy of kindness. I will protect my body tonight."
    },
    "Contact-Ex": {
      title: "📵 Texting/Calling Ex SOS",
      talkDown: "Wait! Sending that text will reset your healing clock back to Day 1. If they wanted to reach out with genuine remorse and change, they would have. Don't hand them the key to your peace.",
      grounding: "Open the Voice Diary and write down the exact message you wanted to send them. Leave it in the Diary and lock the app for 1 hour.",
      mantra: "My dignity and peace are non-negotiable. Silence is my strength."
    }
  };

  const selected = responses[habit] || responses["Smoking"];
  res.json(selected);
});

// ==========================================
// 7. THERAPISTS DIRECTORY
// ==========================================
const defaultTherapists = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    spec: "Trauma, Heartbreak & Relationship Therapy",
    exp: "8",
    email: "ananya.therapy@example.com",
    bio: "Licensed Clinical Psychologist specializing in attachment theory, grief recovery, and emotional rebuilding."
  },
  {
    id: 2,
    name: "Dr. Kabir Malhotra",
    spec: "Cognitive Behavioral Therapy (CBT) & Anxiety",
    exp: "11",
    email: "kabir.counseling@example.com",
    bio: "Helping individuals overcome toxic relationship trauma, narcissistic abuse recovery, and emotional triggers."
  },
  {
    id: 3,
    name: "Dr. Priya Nair",
    spec: "Mindfulness & Self-Worth Coaching",
    exp: "6",
    email: "priya.nair.healing@example.com",
    bio: "Certified therapist dedicated to guiding young adults through post-breakup depression and habit breaking."
  }
];

app.get('/api/therapists', (req, res) => {
  res.json(defaultTherapists);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'BreakChain AI',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`BreakChain AI Server running on http://localhost:${PORT}`);
});
