import { Injectable, computed, effect, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Material, StudyTask, Subject, UserProfile } from '../models/models';

const KEYS = {
  subjects: 'lockin.subjects',
  tasks: 'lockin.tasks',
  materials: 'lockin.materials',
  profile: 'lockin.profile'
} as const;

/**
 * Single source of truth for the whole app.
 * Data lives in Angular signals and is saved to the device with
 * Capacitor Preferences (localStorage in the browser, native storage on
 * Android/iOS). On first run the starter data below is used; after that,
 * whatever was saved is loaded instead.
 * Components only read the exposed signals/methods, so they don't change.
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

  // Becomes true once saved data has been read from storage.
  // Saving is paused until then so the starter data can't overwrite it.
  private readonly loaded = signal(false);

  // Public read-only signals
  readonly subjects = this._subjects.asReadonly();
  readonly tasks = this._tasks.asReadonly();
  readonly materials = this._materials.asReadonly();
  readonly profile = this._profile.asReadonly();

  readonly todaysTasks = computed(() =>
    this._tasks()
      .filter((t) => t.date === this.today())
      .sort((a, b) => this.toMinutes(a.startTime) - this.toMinutes(b.startTime))
  );

  readonly completionRate = computed(() => {
    const tasks = this._tasks();
    if (!tasks.length) return 0;
    return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
  });

  constructor() {
    this.load();

    // Save automatically whenever any of the data changes.
    effect(() => {
      const snapshot = {
        subjects: this._subjects(),
        tasks: this._tasks(),
        materials: this._materials(),
        profile: this._profile()
      };
      if (!this.loaded()) return;
      this.save(snapshot);
    });
  }

  // ---- storage ----
  private async read<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ? (JSON.parse(value) as T) : null;
    } catch (err) {
      console.error(`Could not read "${key}" from storage`, err);
      return null;
    }
  }

  private async load(): Promise<void> {
    const [subjects, tasks, materials, profile] = await Promise.all([
      this.read<Subject[]>(KEYS.subjects),
      this.read<StudyTask[]>(KEYS.tasks),
      this.read<Material[]>(KEYS.materials),
      this.read<UserProfile>(KEYS.profile)
    ]);

    if (subjects) this._subjects.set(subjects);
    if (tasks) this._tasks.set(tasks);
    if (materials) this._materials.set(materials);
    if (profile) this._profile.set(profile);

    this.loaded.set(true);
  }

  private async save(data: {
    subjects: Subject[];
    tasks: StudyTask[];
    materials: Material[];
    profile: UserProfile;
  }): Promise<void> {
    try {
      await Promise.all([
        Preferences.set({ key: KEYS.subjects, value: JSON.stringify(data.subjects) }),
        Preferences.set({ key: KEYS.tasks, value: JSON.stringify(data.tasks) }),
        Preferences.set({ key: KEYS.materials, value: JSON.stringify(data.materials) }),
        Preferences.set({ key: KEYS.profile, value: JSON.stringify(data.profile) })
      ]);
    } catch (err) {
      console.error('Could not save data', err);
    }
  }

  // ---- helpers ----
  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  addDays(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  }

  // Converts '9:00 AM' / '2:30 PM' to minutes since midnight so times sort correctly
  private toMinutes(time: string): number {
    const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!m) return 0;
    let h = parseInt(m[1], 10) % 12;
    if (m[3].toUpperCase() === 'PM') h += 12;
    return h * 60 + parseInt(m[2], 10);
  }

  subjectById(id: string): Subject | undefined {
    return this._subjects().find((s) => s.id === id);
  }

  tasksForDate(date: string): StudyTask[] {
    return this._tasks()
      .filter((t) => t.date === date)
      .sort((a, b) => this.toMinutes(a.startTime) - this.toMinutes(b.startTime));
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