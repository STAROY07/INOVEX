import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const RadarScoreChart = ({ assessment }) => {
  if (!assessment) return null;

  const data = [
    { subject: 'Market Demand', score: assessment.market_demand_score || 70, fullMark: 100 },
    { subject: 'Problem Strength', score: assessment.problem_strength_score || 75, fullMark: 100 },
    { subject: 'Feasibility', score: assessment.feasibility_score || 65, fullMark: 100 },
    { subject: 'Competition', score: assessment.competition_score || 60, fullMark: 100 },
    { subject: 'Business Model', score: assessment.business_model_score || 70, fullMark: 100 },
    { subject: 'Revenue Potential', score: assessment.revenue_potential_score || 75, fullMark: 100 },
    { subject: 'Low Risk', score: assessment.risk_score || 65, fullMark: 100 },
    { subject: 'Scalability', score: assessment.scalability_score || 80, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-lg text-xs">
          <p className="font-bold text-slate-900">{payload[0].payload.subject}</p>
          <p className="text-primary-600 font-bold mt-0.5">
            Score: <span className="text-slate-800">{payload[0].value} / 100</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            stroke="#E2E8F0"
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#4F46E5"
            fill="#6366F1"
            fillOpacity={0.35}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
