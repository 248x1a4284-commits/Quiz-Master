import { QuizQuestion, CategoryId, DifficultyLevel } from '../types/quiz';

// Decode HTML entities commonly returned by OpenTDB
function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

interface OpenTdbQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export async function fetchQuestionsFromApi(
  categoryId: CategoryId,
  apiCategoryId: number | undefined,
  amount: number = 5,
  difficulty?: DifficultyLevel
): Promise<QuizQuestion[]> {
  if (!apiCategoryId) {
    throw new Error('No API category mapped');
  }

  let url = `https://opentdb.com/api.php?amount=${amount}&category=${apiCategoryId}&type=multiple`;
  if (difficulty) {
    url += `&difficulty=${difficulty}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenTDB error: status ${response.status}`);
  }

  const data = await response.json();
  if (data.response_code !== 0 || !Array.isArray(data.results) || data.results.length === 0) {
    throw new Error(`OpenTDB returned response code ${data.response_code}`);
  }

  return (data.results as OpenTdbQuestion[]).map((item, index): QuizQuestion => {
    const rawCorrect = decodeHtml(item.correct_answer);
    const rawIncorrect = item.incorrect_answers.map(decodeHtml);

    // Shuffle options
    const allOptions = [rawCorrect, ...rawIncorrect];
    // Fisher-Yates shuffle
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    const correctIndex = allOptions.indexOf(rawCorrect);

    return {
      id: `api-${categoryId}-${Date.now()}-${index}`,
      category: categoryId,
      question: decodeHtml(item.question),
      options: allOptions.slice(0, 4) as [string, string, string, string],
      correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: `The correct answer is "${rawCorrect}".`,
      difficulty: (item.difficulty as DifficultyLevel) || 'medium',
    };
  });
}
