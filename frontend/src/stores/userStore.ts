import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserProfile {
  id: string
  name: string
  badgeNumber: string
  role: 'investigator' | 'admin' | 'lecturer'
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile>({
    id: 'usr-01',
    name: 'Detektif Tamu',
    badgeNumber: 'CID-7749',
    role: 'investigator'
  })

  function setRole(newRole: 'investigator' | 'admin' | 'lecturer') {
    user.value.role = newRole
  }

  return {
    user,
    setRole
  }
})
