import axios from 'axios'

const API_URL = 'http://localhost:3001/grade/'

const GRADE_VALIDATION = [
  {
    id: 1,
    grade_type: 'Exercícios',
    minValue: 0,
    maxValue: 10,
  },
  {
    id: 2,
    grade_type: 'Trabalho Prático',
    minValue: 0,
    maxValue: 40,
  },
  {
    id: 3,
    grade_type: 'Desafio',
    minValue: 0,
    maxValue: 50,
  },
]

async function getAllGrades() {
  const res = await axios.get(API_URL)

  const grades = res.data.grades.map((grade) => {
    return {
      ...grade,
      studentLowerCase: grade.student.toLowerCase(),
      subjectLowerCase: grade.subject.toLowerCase(),
      typeLowerCase: grade.type.toLowerCase(),
      isDeleted: false,
    }
  })

  let allStudents = new Set()
  grades.forEach(grade => allStudents.add(grade.student))
  allStudents = Array.from(allStudents)

  let allSubjets = new Set()
  grades.forEach(grade => allSubjets.add(grade.subject))
  allSubjets = Array.from(allSubjets)

  let allTypes = new Set()
  grades.forEach(grade => allTypes.add(grade.type))
  allTypes = Array.from(allTypes)

  let maxId = -1
  grades.forEach(({ id }) => {
    if (id > maxId) {
      maxId = id
    }
  })
  let nextId = maxId + 1
  const allCombinations = []
  allStudents.forEach(student => {
    allSubjets.forEach(subject => {
      allTypes.forEach(type => {
        allCombinations.push({
          student,
          subject,
          type
        })
      })
    })
  })

  allCombinations.forEach(({ student, subject, type }) => {
    const hasItem = grades.find(grade => {
      return grade.subject === subject && grade.student === student && grade.type === type
    })
    if (!hasItem) {
      grades.push({
        id: nextId++,
        student,
        studentLowerCase: student.toLowerCase(),
        subject,
        subjectLowerCase: subject.toLowerCase(),
        type,
        typeLowerCase: type.toLowerCase(),
        value: 0,
        isDeleted: true
      })
    }
  })

  grades.sort((a, b) => a.typeLowerCase.localeCompare(b.typeLowerCase))
  grades.sort((a, b) => a.subjectLowerCase.localeCompare(b.subjectLowerCase))
  grades.sort((a, b) => a.studentLowerCase.localeCompare(b.studentLowerCase))
  return grades
}

async function insertGrade(grade) {
  const response = await axios.post(API_URL, grade)
  return response.data.id
}

async function updateGrade(grade) {
  const response = await axios.put(API_URL, grade)
  return response.data
}

async function deleteGrade(grade) {
  const response = await axios.delete(`${API_URL}/${grade.id}`)
  return response.data
}

async function getValidationFromGradeType(gradeType) {
  const gradeValidation = GRADE_VALIDATION.find((item) => {
    return item.gradeType === gradeType
  })
  const { minValue, maxValue } = gradeValidation
  return {
    minValue,
    maxValue,
  }
}

export {
  getAllGrades, insertGrade,
  updateGrade, deleteGrade,
  getValidationFromGradeType
}