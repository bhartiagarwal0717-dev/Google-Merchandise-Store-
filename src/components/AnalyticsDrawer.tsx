import React, { useState, useEffect } from 'react';
import { X, Activity, Trash2, CheckCircle, Clock } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { AnalyticsEvent } from '../types';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const unsubscribe = analytics.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const getEventBadgeColor = (name: AnalyticsEvent['eventName']) => {
    switch (name) {
      case 'Product View':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Search':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Add to Cart':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Begin Checkout':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Payment Started':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Purchase':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-emerald-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Live Analytics Stream</h2>
              <p className="text-xs text-emerald-800 font-medium">Tracking 6 conversion lifecycle events</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => analytics.clear()}
              title="Clear event logs"
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Required Event Status Badges */}
        <div className="p-3 bg-gray-50 border-b border-gray-100 text-xs">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Required PRD Events Checklist:
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {(['Product View', 'Search', 'Add to Cart', 'Begin Checkout', 'Payment Started', 'Purchase'] as const).map((evt) => {
              const hasFired = events.some((e) => e.eventName === evt);
              return (
                <div
                  key={evt}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border font-medium ${
                    hasFired
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  <CheckCircle className={`w-3 h-3 ${hasFired ? 'text-emerald-600' : 'text-gray-300'}`} />
                  <span className="truncate">{evt}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
              <p className="text-sm font-medium">No analytics events fired yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Browse products, search "hoodie", add to cart, or checkout to see real-time data events!
              </p>
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl border border-gray-100 bg-white shadow-2xs hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getEventBadgeColor(
                      evt.eventName
                    )}`}
                  >
                    {evt.eventName}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {evt.timestamp}
                  </span>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg font-mono text-[10px] text-gray-700 overflow-x-auto">
                  <pre>{JSON.stringify(evt.metadata, null, 2)}</pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
