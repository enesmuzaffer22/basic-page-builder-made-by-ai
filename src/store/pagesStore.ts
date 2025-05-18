import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { usePageBuilderStore } from "./pageBuilderStore";
import type { ElementType, ElementStyle } from "../types";

interface PageElementRef {
  id: string;
  type: ElementType;
  content?: string;
  style: ElementStyle;
  children: string[];
  parentId: string | null;
  isGroup?: boolean;
  groupName?: string;
  listItems?: string[];
}

interface Page {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  layers: PageElementRef[];
}

interface PagesState {
  pages: Page[];
  currentPageId: string | null;
  loading: boolean;
  error: string | null;
  fetchUserPages: (userId: string) => Promise<void>;
  createPage: (userId: string, title: string) => Promise<string>;
  updatePage: (pageId: string) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  setCurrentPageId: (pageId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePagesStore = create<PagesState>((set, get) => ({
  pages: [],
  currentPageId: null,
  loading: false,
  error: null,

  fetchUserPages: async (userId) => {
    try {
      set({ loading: true, error: null });
      const pagesRef = collection(db, "pages");
      const q = query(pagesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const pages: Page[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pages.push({
          id: doc.id,
          title: data.title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          layers: data.layers,
        });
      });

      set({ pages });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createPage: async (userId, title) => {
    try {
      set({ loading: true, error: null });
      const timestamp = Date.now();

      // Create empty page with initial layer structure
      const pageData = {
        userId,
        title,
        createdAt: timestamp,
        updatedAt: timestamp,
        layers: [], // Empty layers array for new page
      };

      try {
        const docRef = await addDoc(collection(db, "pages"), pageData);

        const newPage: Page = {
          id: docRef.id,
          title,
          createdAt: timestamp,
          updatedAt: timestamp,
          layers: [],
        };

        set((state) => ({
          pages: [...state.pages, newPage],
          currentPageId: docRef.id,
        }));

        // When creating a new page, the default elements from page builder will be used
        usePageBuilderStore.getState().loadPageData([]);

        return docRef.id;
      } catch (error: unknown) {
        console.error("Firestore operation error:", error);

        const firebaseError = error as Error;

        // Check for different types of errors
        if (
          firebaseError.message &&
          firebaseError.message.includes("permission")
        ) {
          set({
            error:
              "Missing or insufficient permissions. Please make sure your Firebase security rules are configured properly.",
          });
        } else if (
          firebaseError.message &&
          (firebaseError.message.includes("network error") ||
            firebaseError.message.includes("failed"))
        ) {
          set({
            error:
              "It looks like a browser extension (like an ad blocker) is blocking Firebase. Try disabling your ad blocker or adding this site to your whitelist.",
          });
        } else {
          set({ error: firebaseError.message });
        }
        return "";
      }
    } catch (error) {
      set({ error: (error as Error).message });
      return "";
    } finally {
      set({ loading: false });
    }
  },

  updatePage: async (pageId) => {
    try {
      set({ loading: true, error: null });
      const { pages } = get();
      const pageToUpdate = pages.find((page) => page.id === pageId);

      if (!pageToUpdate) {
        throw new Error("Page not found");
      }

      // Get current elements from the page builder store
      const elements = usePageBuilderStore.getState().elements;

      const pageRef = doc(db, "pages", pageId);
      await updateDoc(pageRef, {
        layers: elements,
        updatedAt: Date.now(),
      });

      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                layers: elements as unknown as PageElementRef[],
                updatedAt: Date.now(),
              }
            : page
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deletePage: async (pageId) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, "pages", pageId));

      set((state) => ({
        pages: state.pages.filter((page) => page.id !== pageId),
        currentPageId:
          state.currentPageId === pageId ? null : state.currentPageId,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPageId: (pageId) => {
    // Load page data into the page builder store when changing pages
    if (pageId) {
      const { pages } = get();
      const selectedPage = pages.find((page) => page.id === pageId);

      if (selectedPage) {
        // Load the page elements into the page builder store
        usePageBuilderStore
          .getState()
          .loadPageData(selectedPage.layers as PageElementRef[]);
      }
    }

    set({ currentPageId: pageId });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
