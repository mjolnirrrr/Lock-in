import { Injectable, computed, signal } from '@angular/core';
import { Material, StudyTask, Subject, UserProfile } from '../models/models';

/**
 * Single source of truth for the whole app.
 * Everything lives in memory (Angular signals) — nothing touches a network.
 * Swap this service's internals for real HTTP calls later without touching
 * any component, since components only ever read the exposed signals/methods.
 */
@Injectable({ providedIn: 'root' })
export class MockDataService {
  private readonly _subjects = signal<Subject[]>([
    { id: 'calc', name: 'Calculus', icon: 'calculator-outline', color: '#6C63FF', topicCount: 5, progress: 62 },
    { id: 'phys', name: 'Physics', icon: 'planet-outline', color: '#2ECC71', topicCount: 4, progress: 40 },
    { id: 'chem', name: 'Chemistry', icon: 'flask-outline', color: '#F5A623', topicCount: 3, progress: 78 },
    { id: 'bio', name: 'Biology', icon: 'leaf-outline', color: '#EB5757', topicCount: 4, progress: 25 }
  ]);

  private readonly _tasks = signal<StudyTask[]>([
    { id: 't1', title: 'Review Calculus Notes', subjectId: 'calc', type: 'session', date: this.today(), startTime: '9:00 AM', endTime: '10:00 AM', done: true },
    { id: 't2', title: 'Practice Quiz', subjectId: 'phys', type: 'quiz', date: this.today(), startTime: '11:00 AM', endTime: '12:00 PM', done: true },
    { id: 't3', title: 'Read Physics Chapter 3', subjectId: 'phys', type: 'activity', date: this.today(), startTime: '2:00 PM', done: false },
    { id: 't4', title: 'Study Session', subjectId: 'phys', type: 'session', date: this.today(), startTime: '2:00 PM', endTime: '3:30 PM', done: false },
    { id: 't5', title: 'Chemistry Lab Prep', subjectId: 'chem', type: 'activity', date: this.addDays(1), startTime: '10:00 AM', done: false },
    { id: 't6', title: 'Biology Flashcards', subjectId: 'bio', type: 'quiz', date: this.addDays(2), startTime: '4:00 PM', done: false }
  ]);

  private readonly _materials = signal<Material[]>([
    { id: 'm1', name: 'Calculus Notes.pdf', subjectId: 'calc', kind: 'pdf', size: '2.4 MB', addedOn: this.today() },
    { id: 'm2', name: 'Physics Formulas.png', subjectId: 'phys', kind: 'image', size: '1.2 MB', addedOn: this.today() },
    { id: 'm3', name: 'Chapter 3 Summary.docx', subjectId: 'chem', kind: 'doc', size: '320 KB', addedOn: this.addDays(-1) },
    { id: 'm4', name: 'Graph Example.png', subjectId: 'calc', kind: 'image', size: '1.1 MB', addedOn: this.addDays(-2) },
    { id: 'm5', name: 'Formula Sheet.docx', subjectId: 'phys', kind: 'doc', size: '210 KB', addedOn: this.addDays(-3) }
  ]);

  private readonly _profile = signal<UserProfile>({
    name: 'Juan Delacruz',
    email: 'juan.delacruz27@gmail.com',
    avatarInitials: 'JD',
    studyStreak: 7,
    totalStudyHours: 42,
    quizzesTaken: 18,
    averageScore: 86
  });

  // Public read-only signals
  readonly subjects = this._subjects.asReadonly();
  readonly tasks = this._tasks.asReadonly();
  readonly materials = this._materials.asReadonly();
  readonly profile = this._profile.asReadonly();

  readonly todaysTasks = computed(() =>
    this._tasks().filter((t) => t.date === this.today()).sort((a, b) => a.startTime.localeCompare(b.startTime))
  );

  readonly completionRate = computed(() => {
    const tasks = this._tasks();
    if (!tasks.length) return 0;
    return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
  });

  // ---- helpers ----
  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  addDays(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  }

  subjectById(id: string): Subject | undefined {
    return this._subjects().find((s) => s.id === id);
  }

  tasksForDate(date: string): StudyTask[] {
    return this._tasks()
      .filter((t) => t.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  // ---- mutations ----
  toggleTaskDone(id: string): void {
    this._tasks.update((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  addTask(task: Omit<StudyTask, 'id' | 'done'>): void {
    const id = 't' + Math.random().toString(36).slice(2, 9);
    this._tasks.update((list) => [...list, { ...task, id, done: false }]);
  }

  addMaterial(material: Omit<Material, 'id' | 'addedOn'>): void {
    const id = 'm' + Math.random().toString(36).slice(2, 9);
    this._materials.update((list) => [{ ...material, id, addedOn: this.today() }, ...list]);
  }

  removeMaterial(id: string): void {
    this._materials.update((list) => list.filter((m) => m.id !== id));
  }
}
