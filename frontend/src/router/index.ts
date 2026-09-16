import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CaseBriefView from '../views/CaseBriefView.vue'
import InvestigationView from '../views/InvestigationView.vue'
import EvidenceView from '../views/EvidenceView.vue'
import SuspectView from '../views/SuspectView.vue'
import ConclusionView from '../views/ConclusionView.vue'
import ResultView from '../views/ResultView.vue'

// Admin Views
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import CaseManagementView from '../views/admin/CaseManagementView.vue'
import CaseEditorView from '../views/admin/CaseEditorView.vue'
import SceneEditorView from '../views/admin/SceneEditorView.vue'

const routes = [
  // Game & Player Routes
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cases',
    redirect: '/'
  },
  {
    path: '/cases/:id',
    name: 'case-brief',
    component: CaseBriefView
  },
  {
    path: '/cases/:id/investigate',
    name: 'investigate',
    component: InvestigationView
  },
  {
    path: '/cases/:id/evidence',
    name: 'evidence-board',
    component: EvidenceView
  },
  {
    path: '/cases/:id/suspects',
    name: 'suspects-board',
    component: SuspectView
  },
  {
    path: '/cases/:id/conclusion',
    name: 'conclusion',
    component: ConclusionView
  },
  {
    path: '/cases/:id/result',
    name: 'result',
    component: ResultView
  },

  // Admin / Lecturer Routes
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardView
  },
  {
    path: '/admin/cases',
    name: 'admin-case-management',
    component: CaseManagementView
  },
  {
    path: '/admin/cases/create',
    name: 'admin-case-create',
    component: CaseEditorView
  },
  {
    path: '/admin/cases/:id/edit',
    name: 'admin-case-edit',
    component: CaseEditorView
  },
  {
    path: '/admin/cases/:id/scenes',
    name: 'admin-case-scenes',
    component: SceneEditorView
  },
  {
    path: '/admin/cases/:id/scenes/:sceneId',
    name: 'admin-case-scene-detail',
    component: SceneEditorView
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

