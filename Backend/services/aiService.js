  import { geminiModel } from '../config/gemini.js';

  export class AIService {
    static async generateAffirmations(problemData) {
      try {
        const { category, title, description, severity } = problemData;
        
        console.log('AI Service called with:', problemData);
        
        const prompt = `
  You are a compassionate AI assistant specializing in creating personalized affirmations and solutions for personal growth.

  Problem Details:
  - Category: ${category}
  - Title: ${title}
  - Description: ${description}
  - Severity (1-10): ${severity}

  Please provide:
  1. 5 positive affirmations that are specific, empowering, and directly address the problem
  2. 3 practical solutions or action steps
  3. 2 motivational statements

  Format your response as JSON with this structure:
  {
    "affirmations": [
      "affirmation 1",
      "affirmation 2",
      "affirmation 3",
      "affirmation 4",
      "affirmation 5"
    ],
    "solutions": [
      "solution 1",
      "solution 2", 
      "solution 3"
    ],
    "motivational": [
      "motivational statement 1",
      "motivational statement 2"
    ]
  }

  Make the affirmations:
  - Present tense and positive
  - Specific to the problem
  - Believable and achievable
  - Empowering and encouraging
  - Personal and direct (use "I" statements)

  Make the solutions:
  - Practical and actionable
  - Specific steps they can take
  - Realistic and achievable
  - Directly related to the problem

  Make the motivational statements:
  - Inspiring and uplifting
  - Focus on growth and potential
  - Encourage persistence and self-belief
  `;

        console.log('Calling Gemini AI...');
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw AI response:', text);
        
        // Try to parse JSON response
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log('Parsed AI response:', parsed);
            return parsed;
          }
        } catch (parseError) {
          console.error('Failed to parse AI response as JSON:', parseError);
        }
        
        // Fallback: return structured response even if JSON parsing fails
        return {
          affirmations: [
            "I am capable of overcoming this challenge",
            "I have the strength to work through this situation",
            "I am worthy of positive change and growth",
            "I trust in my ability to find solutions",
            "I am resilient and can handle whatever comes my way"
          ],
          solutions: [
            "Break down the problem into smaller, manageable steps",
            "Seek support from trusted friends, family, or professionals",
            "Practice self-care and maintain a positive mindset"
          ],
          motivational: [
            "Every challenge is an opportunity for growth and learning",
            "You have overcome difficulties before and you can do it again"
          ]
        };
        
      } catch (error) {
        console.error('AI service error:', error);
        throw new Error('Failed to generate affirmations');
      }
    }

    static async generatePersonalizedAffirmation(problemData, userPreferences = {}) {
      try {
        const { category, description } = problemData;
        const { tone = 'encouraging', length = 'medium' } = userPreferences;
        
        const prompt = `
  Create a personalized affirmation for someone dealing with:
  Category: ${category}
  Problem: ${description}
  Tone: ${tone}
  Length: ${length}

  Generate a single, powerful affirmation that is:
  - Personal and specific to their situation
  - Positive and empowering
  - Believable and achievable
  - In present tense using "I" statements
  - Tailored to their specific problem description

  Return only the affirmation text, no additional formatting.
  `;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
        
      } catch (error) {
        console.error('Personalized affirmation error:', error);
        return "I am capable of overcoming this challenge and growing stronger through it.";
      }
    }
  }
