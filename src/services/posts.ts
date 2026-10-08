import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Post, SavedPost, PostStatus } from '../types';

export const INITIAL_SEED_POSTS: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>[] = [
  {
    title: "The quiet power of doing one thing",
    slug: "the-quiet-power-of-doing-one-thing",
    excerpt: "In a culture that glorifies cognitive fracturing and endless tabs, radical single-tasking is the ultimate sanctuary for your nervous system.",
    content: `We live in an age of fragmented attention. The average person checks their device every twelve minutes, switching contexts dozens of times an hour without ever realizing the subtle, cumulative exhaustion it produces in the prefrontal cortex.

When we attempt to multitask, our brain does not actually process multiple parallel streams of deep thought. Instead, it rapidly toggles between cognitive frames. Each switch imposes a cognitive switching cost—a micro-leak of dopamine, mental energy, and spatial presence. Over the course of an afternoon, this fragmentation masquerades as productivity, but leaves behind a hollow, restless fatigue.

### The Myth of Simultaneous Focus

Single-tasking is not merely an efficiency tactic; it is an act of nervous system reclamation. When you commit entirely to one single action—whether it is drafting an essay, brewing tea, or listening to a loved one—you signal to your sympathetic nervous system that the present moment is safe enough to inhabit without scanning for threat.

Notice what happens in your physiology when you close twelve browser windows and leave only the one document you are attending to. The breath drops lower into the belly. The shoulders release half an inch. The relentless internal narrator slows down because it no longer has to negotiate competing priorities in every millisecond.

### Practical Protocols for Monotasking

1. **The 25-Minute Monotask Block**: Choose one single objective. No ambient music with lyrics, no secondary monitors, no background messaging clients. Give your attention as a devotional gift to the task.
2. **The Friction Barrier**: When working on something deep, introduce physical friction between you and distraction. Put your smartphone in another room or turn off your Wi-Fi interface.
3. **The Micro-Pause**: When you finish one task, do not immediately leap into the next. Pause for three diaphragmatic breaths. Allow your cognitive working memory to clear the buffer.

True depth cannot be hurried. By doing one thing with pristine presence, you rediscover that the quietest moments are often the most transformative.`,
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    category: "Mindfulness",
    tags: ["Focus", "Digital Wellness", "Clarity", "Presence"],
    authorId: "editorial-team",
    authorName: "Elena Vance",
    authorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    status: "published",
    featured: true,
    readingTime: 4
  },
  {
    title: "Rest isn't the opposite of progress",
    slug: "rest-isnt-the-opposite-of-progress",
    excerpt: "True recovery is not what you do when you have run out of fuel; it is the fertile ground from which all meaningful creative clarity emerges.",
    content: `Modern hustle orthodoxy has poisoned our relationship with non-action. We have been conditioned to view rest as a transactional reward—a biological tax we begrudgingly pay so we can resume producing tomorrow.

Yet neurobiology tells a profoundly different story. During deliberate stillness, the brain’s default mode network (DMN) activates. Far from going dark, this network integrates disparate memories, consolidates complex emotional learning, and weaves together the intuitive breakthroughs that intentional analytical thought can never force.

### The Seven Types of Rest

True restorative hygiene requires recognizing that physical sleep alone cannot repair psychological exhaustion. Consider the dimensional textures of rest:

* **Sensory Rest**: Stepping away from artificial blue illumination, urban decibels, and high-cadence notification pings.
* **Emotional Rest**: Dropping the performance of being "fine" or endlessly accommodating, allowing yourself the authenticity of neutral quietude.
* **Creative Rest**: Immersing yourself in unmeasured natural beauty—watching dappled light through birch leaves or listening to rainfall—without an agenda to monetize or summarize the experience.
* **Mental Rest**: Taking scheduled cognitive pauses every ninety minutes to prevent neural fatigue.

### Uncoupling Worth from Velocity

When you observe nature, nothing blooms all year round. The winter forest is not lazy; it is concentrating its vital fluids within the roots, preparing the cellular structure for resilient spring renewal.

Give yourself permission to pause without apology today. Rest is not the absence of work; it is the subtle architecture of endurance.`,
    coverImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
    category: "Rest & Renewal",
    tags: ["Recovery", "Burnout", "Sleep", "Pacing"],
    authorId: "editorial-team",
    authorName: "Marcus Thorne",
    authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    status: "published",
    featured: true,
    readingTime: 5
  },
  {
    title: "How to make room for a difficult feeling",
    slug: "how-to-make-room-for-a-difficult-feeling",
    excerpt: "Resistance turns pain into suffering. Here is a somatic and psychological framework for welcoming discomfort without being consumed by it.",
    content: `When grief, anxiety, or acute disappointment arrives, our instinctive reflex is either suppression or catastrophic identification. We push the knot into our stomach, or we spin elaborate catastrophic stories about what the feeling means about our worth or our future.

Both responses misjudge what an emotion fundamentally is: a temporary physiological wave of neurochemical messengers that lasts approximately ninety seconds in the physical body—unless sustained by repetitive narrative rumination.

### The RAIN Architecture

Developed by modern contemplative psychologists, the RAIN framework offers a compassionate, grounded harbor when internal turbulence strikes:

1. **R — Recognize**: Acknowledge what is actually happening right now. Name it gently under your breath: *"Here is anxiety. Here is a tightness in the throat."* Naming shifts activation from the reactive amygdala to the reflective prefrontal cortex.
2. **A — Allow**: Grant the experience permission to exist just as it is for the next two minutes. Drop the struggle to fix, banish, or analyze it. Say silently: *"I allow this sensation to be here right now."*
3. **I — Investigate**: Bring warm, curious somatosensory awareness to your physical form. Where does the feeling live? Is it heavy, hot, fluttering, or constricted? What does it need?
4. **N — Nurture (Non-Identification)**: Place a hand over your heart or solar plexus. Offer yourself the soothing reassurance you would give a frightened child. Remember: you are the spacious sky through which the weather of emotion passes.

### Expanding Your Window of Tolerance

You do not need to eradicate pain to live a life of immense presence and dignity. When you make gentle room for sadness or apprehension, you discover something wondrous: your capacity to hold tenderness is far greater than your fear of discomfort.`,
    coverImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80",
    category: "Emotional Agility",
    tags: ["Somatic", "Anxiety", "Compassion", "Resilience"],
    authorId: "editorial-team",
    authorName: "Dr. Alistair Finch",
    authorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    status: "published",
    featured: true,
    readingTime: 6
  },
  {
    title: "The architecture of a slow morning",
    slug: "the-architecture-of-a-slow-morning",
    excerpt: "How the first sixty minutes of your day calibrate your nervous system’s baseline reactivity for the entire waking cycle.",
    content: `The way you cross the threshold of consciousness sets the neurological tone for everything that follows. Reaching for a smartphone within seconds of opening your eyes floods the waking brain with high-beta frequency urgency before your parasympathetic system has properly bridged from delta sleep.

### Designing a Low-Reactivity Morning Sanctuary

* **Delay the Input Flood**: Keep the first 45 minutes completely screen-free. Let your thoughts belong to you before algorithmic feeds colonize your attention.
* **Natural Photon Alignment**: Step outside or stand by an open window for 5–10 minutes of indirect morning sunlight to anchor your circadian cortisol awakening response.
* **Warm Hydration**: Drink a generous cup of lukewarm water with a pinch of sea salt before introducing caffeine.
* **Intentional Movement**: Five minutes of gentle spinal unwinding or intuitive somatic stretching ground your spirit into your physical vessel.`,
    coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    category: "Daily Rituals",
    tags: ["Morning Routine", "Circadian", "Nervous System", "Habits"],
    authorId: "editorial-team",
    authorName: "Elena Vance",
    authorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    status: "published",
    featured: false,
    readingTime: 4
  },
  {
    title: "Unraveling cognitive spirals before sleep",
    slug: "unraveling-cognitive-spirals-before-sleep",
    excerpt: "A physiological and mental toolkit to dismantle evening overthinking and gently guide the brain into deep restoration.",
    content: `Why does the mind choose midnight to prosecute every awkward conversation from seven years ago? 

During evening hours, executive frontal inhibition naturally drops, while the emotional brain remains vigilant. Without external inputs to ground focus, the mind projects its unresolved micro-tensions into imaginary futures and regretful pasts.

### The Cognitive Offloading Protocol

* **The Brain Dump Journal**: Ten minutes before bed, write down every open loop, task, and unresolved anxiety onto paper. Physical writing signals closure to the brain's cognitive cache.
* **Cognitive Shuffling**: Instead of counting sheep, imagine random, neutral nouns beginning with consecutive letters of the alphabet (Apple, Barn, Cloud, Driftwood). This scrambles narrative loops and induces sleep spindles.
* **Extended Exhalation**: Breathe in for four counts, hold for two, and exhale gently for six counts. Long exhalations stimulate the vagus nerve and slow the cardiac pacemaker.`,
    coverImage: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=1200&q=80",
    category: "Rest & Renewal",
    tags: ["Sleep", "Insomnia", "Vagus Nerve", "Mindset"],
    authorId: "editorial-team",
    authorName: "Marcus Thorne",
    authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    status: "published",
    featured: false,
    readingTime: 5
  },
  {
    title: "Why your nervous system craves stillness",
    slug: "why-your-nervous-system-craves-stillness",
    excerpt: "Silence is not the absence of noise; it is the presence of your own innate psychological equilibrium.",
    content: `Silence has become an endangered commodity in modern industrial environments. Continuous auditory inputs trigger elevated ambient cortisol and vasoconstriction, keeping the amygdala on subtle high alert throughout the daylight hours.

In neuroscientific investigations, brief periods of absolute silence stimulate neurogenesis in the hippocampus—the master hub of learning, spatial memory, and emotional balance.

### Cultivating Micro-Doses of Silence

* **Silent Commutes**: Spend one commute per week in complete silence. No podcasts, no radio, no phone calls.
* **The Two-Minute Gap**: Between meetings or deep work sessions, sit quietly with closed eyes and observe the ambient stillness in the room.
* **Nature Immersion**: Spend time in landscapes where the predominant sounds are organic—wind in pine needles, moving water, or birdsong.

Stillness is not an indulgence. It is the fundamental baseline upon which mental clarity, creativity, and inner peace are built.`,
    coverImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80",
    category: "Neuroscience",
    tags: ["Stillness", "Silence", "Neurogenesis", "Peace"],
    authorId: "editorial-team",
    authorName: "Dr. Alistair Finch",
    authorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    status: "published",
    featured: false,
    readingTime: 5
  }
];

export async function seedInitialPostsIfEmpty(): Promise<void> {
  try {
    const postsCol = collection(db, 'posts');
    const q = query(postsCol, limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('Seeding initial Mental Tactic journal articles into Firestore...');
      for (const item of INITIAL_SEED_POSTS) {
        await addDoc(postsCol, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          publishedAt: serverTimestamp()
        });
      }
      console.log('Seeding completed successfully.');
    }
  } catch (error) {
    console.warn('Seed operation skipped or pending permission:', error);
  }
}

export async function getPublishedPosts(category?: string, tag?: string): Promise<Post[]> {
  const path = 'posts';
  try {
    const postsCol = collection(db, 'posts');
    let q = query(postsCol, where('status', '==', 'published'));
    
    if (category && category !== 'All') {
      q = query(q, where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];

    // If Firestore has no documents yet, return initial seed data mapped with IDs
    if (posts.length === 0) {
      let filtered = INITIAL_SEED_POSTS.map((item, idx) => ({
        id: `seed-${idx}`,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      })) as Post[];

      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (tag) {
        filtered = filtered.filter(p => p.tags.includes(tag));
      }
      return filtered;
    }

    if (tag) {
      posts = posts.filter(p => p.tags && p.tags.includes(tag));
    }

    // Sort by publication timestamp or created
    posts.sort((a, b) => {
      const timeA = a.publishedAt?.toMillis ? a.publishedAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.publishedAt?.toMillis ? b.publishedAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return posts;
  } catch (error) {
    console.warn('Falling back to local editorial seed content:', error);
    let filtered = INITIAL_SEED_POSTS.map((item, idx) => ({
      id: `seed-${idx}`,
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    })) as Post[];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      filtered = filtered.filter(p => p.tags.includes(tag));
    }
    return filtered;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const path = `posts[slug=${slug}]`;
  try {
    const postsCol = collection(db, 'posts');
    const q = query(postsCol, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Post;
    }

    // Check seed posts fallback
    const seedFound = INITIAL_SEED_POSTS.find(p => p.slug === slug);
    if (seedFound) {
      return {
        id: `seed-${slug}`,
        ...seedFound,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      } as Post;
    }

    return null;
  } catch (error) {
    const seedFound = INITIAL_SEED_POSTS.find(p => p.slug === slug);
    if (seedFound) {
      return {
        id: `seed-${slug}`,
        ...seedFound,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      } as Post;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  const path = `posts/${id}`;
  try {
    if (id.startsWith('seed-')) {
      const index = parseInt(id.replace('seed-', ''), 10);
      if (!isNaN(index) && INITIAL_SEED_POSTS[index]) {
        return {
          id,
          ...INITIAL_SEED_POSTS[index],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        } as Post;
      }
    }

    const docSnap = await getDoc(doc(db, 'posts', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const path = 'posts';
  try {
    const postsCol = collection(db, 'posts');
    const snapshot = await getDocs(postsCol);
    if (snapshot.empty) {
      return INITIAL_SEED_POSTS.map((item, idx) => ({
        id: `seed-${idx}`,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      })) as Post[];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'posts';
  try {
    const postsCol = collection(db, 'posts');
    const docRef = await addDoc(postsCol, {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: postData.status === 'published' ? serverTimestamp() : null
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<void> {
  const path = `posts/${id}`;
  try {
    const postRef = doc(db, 'posts', id);
    const updatePayload: Record<string, any> = {
      ...postData,
      updatedAt: serverTimestamp()
    };
    if (postData.status === 'published' && !postData.publishedAt) {
      updatePayload.publishedAt = serverTimestamp();
    }
    await updateDoc(postRef, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePost(id: string): Promise<void> {
  const path = `posts/${id}`;
  try {
    await deleteDoc(doc(db, 'posts', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// SAVED ARTICLES
export async function getSavedPosts(uid: string): Promise<SavedPost[]> {
  const path = `users/${uid}/savedPosts`;
  try {
    const savedCol = collection(db, 'users', uid, 'savedPosts');
    const snapshot = await getDocs(savedCol);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SavedPost[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function savePost(uid: string, post: Post): Promise<void> {
  const path = `users/${uid}/savedPosts/${post.id}`;
  try {
    const savedRef = doc(db, 'users', uid, 'savedPosts', post.id);
    const savedData: Omit<SavedPost, 'id'> = {
      postId: post.id,
      postTitle: post.title,
      postSlug: post.slug,
      postExcerpt: post.excerpt,
      postCoverImage: post.coverImage,
      postCategory: post.category,
      savedAt: serverTimestamp()
    };
    await setDoc(savedRef, savedData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeSavedPost(uid: string, postId: string): Promise<void> {
  const path = `users/${uid}/savedPosts/${postId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'savedPosts', postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function isPostSaved(uid: string, postId: string): Promise<boolean> {
  const path = `users/${uid}/savedPosts/${postId}`;
  try {
    const savedRef = doc(db, 'users', uid, 'savedPosts', postId);
    const docSnap = await getDoc(savedRef);
    return docSnap.exists();
  } catch (error) {
    return false;
  }
}
