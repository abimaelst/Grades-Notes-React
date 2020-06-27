import React from 'react'
import Action from './Action'

export default function GradesControl({ grades, onDelete, onPersist }) {
  const tableGrades = []

  let currentStudent = grades[0].student
  let currentSubject = grades[0].subject
  let currectGrades = []
  let id = 1

  grades.forEach((grade) => {
    if (grade.subject !== currentSubject) {
      tableGrades.push({
        id: id++,
        student: currentStudent,
        subject: currentSubject,
        grades: currectGrades,
      })
      currentSubject = grade.subject
      currectGrades = []
    }
    if (grade.student !== currentStudent) {
      currentStudent = grade.student
    }
    currectGrades.push(grade)
  });

  //Após o loop devemos inserir o último elemento
  tableGrades.push({
    id: id++,
    student: currentStudent,
    subject: currentSubject,
    grades: currectGrades,
  })

  const handleActionClick = (id, type) => {
    const grade = grades.find(grade => grade.id === id)
    if (type === 'delete') {
      onDelete(grade)
      return
    }

    onPersist(grade)
  }

  return (
    <div className='container'>
      {tableGrades.map(({ id, grades }) => {
        const finalGrade = grades.reduce((acc, curr) => {
          return acc + curr.value
        }, 0)
        const gradeStyle = finalGrade >= 70 ? style.goodGrade : style.badGrade
        return (
          <table style={style.table} className='striped  center' key={id}>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Aluno</th>
                <th style={{ width: '20%' }}>Disciplina</th>
                <th style={{ width: '20%' }}>Avaliação</th>
                <th style={{ width: '20%' }}>Nota</th>
                <th style={{ width: '20%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(
                ({ id, subject, student, type, value, isDeleted }) => {
                  return (
                    <tr style={style.tableLine} key={id}>
                      <td>{student}</td>
                      <td>{subject}</td>
                      <td>{type}</td>
                      <td>{isDeleted ? '-' : value}</td>
                      <td>
                        <div>
                          <Action onActionClick={handleActionClick} id={id} type={isDeleted ? 'add' : 'edit'} />
                          {!isDeleted && < Action onActionClick={handleActionClick} id={id} type={'delete'} />}
                        </div>
                      </td>
                    </tr>
                  )
                }
              )}
            </tbody>
            <tfoot>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td style={{ textAlign: 'rigth' }}><strong>Total</strong></td>
                <td><span style={gradeStyle}>{finalGrade}</span></td>
              </tr>
            </tfoot>
          </table>
        )
      })}
    </div>
  )
}

const style = {
  goodGrade: {
    fontWeight: 'bold',
    color: 'green',
  },
  badGrade: {
    fontWeight: 'bold',
    color: 'red',
  },
  table: {
    margin: '20px',
    padding: '10px',
    border: '0 1px 0 1px, solid, black'
  },
  tableLine: {
    border: '1px 1px solid lightgray'
  },
}

