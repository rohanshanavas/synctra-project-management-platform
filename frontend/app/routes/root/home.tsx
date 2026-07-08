import React from 'react'
import type { Route } from '../../+types/root';
import { Button } from '@/components/ui/button';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Synctra" },
    { name: "description", content: "Welcome to Synctra!" },
  ];
}

const Homepage = () => {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}

export default Homepage