import React from 'react';
import KnowledgeBuilder from '../components/KnowledgeBuilder';

interface KnowledgeBuilderScreenProps {
  token?: string;
}

const KnowledgeBuilderScreen: React.FC<KnowledgeBuilderScreenProps> = ({ token }) => (
  <KnowledgeBuilder token={token} />
);

export default KnowledgeBuilderScreen;
