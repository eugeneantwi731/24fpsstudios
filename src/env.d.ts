/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    adminUser?: {
      id: string;
      username: string;
      role: 'admin' | 'editor';
    };
  }
}