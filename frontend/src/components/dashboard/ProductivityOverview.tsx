import React from 'react';
import { BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { AnalyticsDataPoint } from '../../types';

// Import public folder icon assets
import streakIcon from '../../public/streak.png';
import trophyIcon from '../../public/trophy.png';

interface ProductivityOverviewProps {
  completedTasksCount: number;
  analyticsData?: AnalyticsDataPoint[];
}

export const ProductivityOverview: React.FC<ProductivityOverviewProps> = ({
  completedTasksCount,
  analyticsData,
}) => {
  const chartData = analyticsData?.map((item) => ({
    name: item.day,
    count: item.count,
  })) || [
      { name: 'Mon', count: 0 },
      { name: 'Tue', count: 0 },
      { name: 'Wed', count: 0 },
      { name: 'Thu', count: 0 },
      { name: 'Fri', count: 0 },
      { name: 'Sat', count: 0 },
      { name: 'Sun', count: 0 },
    ];

  const maxCount = analyticsData ? Math.max(...analyticsData.map((d) => d.count)) : 0;
  const yAxisDomain = [0, Math.max(5, maxCount)];

  const calculateStreak = (dataList: AnalyticsDataPoint[] | undefined) => {
    if (!dataList || dataList.length === 0) return 0;

    let streak = 0;
    const todayIndex = dataList.length - 1;

    let startIndex = todayIndex;
    if (dataList[todayIndex]?.count === 0) {
      if (todayIndex > 0 && (dataList[todayIndex - 1]?.count ?? 0) > 0) {
        startIndex = todayIndex - 1;
      } else {
        return 0;
      }
    }

    for (let i = startIndex; i >= 0; i--) {
      if ((dataList[i]?.count ?? 0) > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak(analyticsData);

  return (
    <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm space-y-5">
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 text-left">
        <BarChart2 className="w-4 h-4 text-[#4F46E5]" />
        <span>Productivity Overview</span>
      </h3>

      <div className="h-40 w-full pt-2 text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 600 }}
            />
            <YAxis
              domain={yAxisDomain}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
              }}
              formatter={(value: any) => [value, 'Completed Tasks']}
              labelClassName="font-black text-slate-900"
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#4F46E5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
              dot={{ stroke: '#4F46E5', strokeWidth: 2, r: 3, fill: '#ffffff' }}
              activeDot={{ r: 5, strokeWidth: 0, fill: '#4F46E5' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left">

        <div className="p-3.5 bg-gradient-to-br from-indigo-50/40 to-indigo-100/10 border border-indigo-100/40 rounded-xl leading-normal flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black text-indigo-600 block uppercase tracking-wider">This Week</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">{completedTasksCount}</span>
            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Completed</span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <div className="absolute -bottom-0.5 w-7 h-2 bg-indigo-500/20 rounded-full blur-[4px] pointer-events-none"></div>
            <img src={trophyIcon} alt="Completed Trophy" className="w-full h-full object-contain relative z-10" />
          </div>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-orange-50/40 to-orange-100/10 border border-orange-100/40 rounded-xl leading-normal flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black text-orange-600 block uppercase tracking-wider">Streak</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">
              {streakDays}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Days</span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <div className="absolute -bottom-0.5 w-7 h-2 bg-orange-500/30 rounded-full blur-[4px] pointer-events-none"></div>
            <img src={streakIcon} alt="Streak Flame" className="w-full h-full object-contain relative z-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityOverview;
