
import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-2 ${tool.color}`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${tool.color} text-white flex items-center justify-center text-xl`}>
              <i className={`fab ${tool.icon.startsWith('fa-') ? '' : 'fa-'}${tool.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{tool.name}</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
            {tool.category}
          </span>
        </div>
        
        <p className="text-slate-600 mb-4 leading-relaxed">
          {tool.description}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <i className="fas fa-bullseye text-blue-500"></i> Cas d'usage
            </h4>
            <ul className="text-sm text-slate-600 space-y-1 ml-6 list-disc">
              {tool.useCases.map((uc, i) => <li key={i}>{uc}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <i className="fas fa-star text-amber-500"></i> Avantages
            </h4>
            <ul className="text-sm text-slate-600 space-y-1 ml-6 list-disc">
              {tool.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
