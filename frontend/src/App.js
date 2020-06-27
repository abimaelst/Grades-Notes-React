import React, { useState, useEffect } from 'react'
import * as api from './api/apiService'
import Spinner from './components/Spinner'
import GradesControl from './components/GradesControl'
import ModalGrade from './components/ModalGrade'

export default function App() {
  const [allGrades, setAllGrades] = useState([])
  const [selectedGrade, setSelectGrade] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function getGrades() {
      const grades = await api.getAllGrades()
      setTimeout(() => {
        setAllGrades(grades)
      }, 2000)
    }
    getGrades()
  }, [])

  const handleDelete = async (grade) => {
    const isDeleted = await api.deleteGrade(grade)

    if (isDeleted) {
      const deletedGradeIndex =
        allGrades.findIndex(item => item.id === grade.id)

      const newGrades = Object.assign([], allGrades)
      newGrades[deletedGradeIndex].isDeleted = true
      newGrades[deletedGradeIndex].value = 0

      setAllGrades(newGrades)
    }
  }

  const handlePersist = (grade) => {
    setSelectGrade(grade)
    setIsModalOpen(true)
  }

  const handlePersistData = async (formData) => {
    const { id, newValue } = formData

    const newGrades = Object.assign([], allGrades)
    const gradesToPersist = newGrades.find(grade => grade.id === id)
    gradesToPersist.value = newValue

    if (gradesToPersist.isDeleted) {
      gradesToPersist.isDeleted = false
      await api.insertGrade(gradesToPersist)
    } else {
      await api.updateGrade(gradesToPersist)
    }
    setIsModalOpen(false)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }
  return (
    <div>
      <h1 className='center'>Controle de Notas</h1>

      {allGrades.length === 0 && <Spinner />}
      {allGrades.length > 0 && (
        <GradesControl
          grades={allGrades}
          onDelete={handleDelete}
          onPersist={handlePersist}
        />
      )}
      {isModalOpen && <ModalGrade onSave={handlePersistData}
        onClose={handleClose} selectedGrade={selectedGrade}
      />}
    </div>
  )
}