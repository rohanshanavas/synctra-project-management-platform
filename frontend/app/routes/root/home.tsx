import React from 'react'
import type { Route } from '../../+types/root';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Synctra" },
    { name: "description", content: "Welcome to Synctra!" },
  ];
}

const Homepage = () => {
  return (
    <div>Homepage</div>
  )
}

export default Homepage