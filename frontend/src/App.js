import React from 'react'
import * as api from './api/apiService'

export default function App() {
  const testeApi = async () => {
    const result = await api.getAllGrades()
    console.log(result)
  }

  testeApi()
  return <p>Olá Hooks</p>
}