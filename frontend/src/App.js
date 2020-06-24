import React, { useState } from 'react'
import * as api from './api/apiService'

export default function App() {
  const [allGrades, setAllGrades] = useState([])
  const [selectedGrade, setSelectGrade] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <h1>Controle de Notas</h1>

      {allGrades.length > 0 && <p>Notas disponíveis</p>}
      {allGrades.length == 0 && <p>Carregando notas...</p>}
    </div>
  )
}