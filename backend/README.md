# Backend Structure

## To-do

[] SessionId // Toda vez que uma sessao iniciar, deve-se gerar um uuid.
[] Inicio
  - cards: { xGames: 5, xAchievements: 5, xCoins: 5 }
  - barChart: { labels: ['label1'] , data: [5] } // Pontos por dia
[] Conquistas
  - achievements: [{ image: 'http://...', title: 'bla', description: 'blabla', acquired: true/false }]
[] Exercicios
  - taks: [{ title: 'bla', points: 80, maxPoints: 100, taskId: 1 }]
    - questions: [{ question: 'blabla?', possibleAnswers: ['bla', 'blabla'] }]

[] 6 rotas
