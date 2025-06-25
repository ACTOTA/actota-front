'use client';

import React from 'react';
import { MdOutlineExplore, MdOutlineDirectionsCarFilled } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
import { BiSolidMap } from 'react-icons/bi';
import Button from '@/src/components/figma/Button';
import ItineraryFilterPieChart from '@/src/components/ItineraryFilterPieChart';
import { ItineraryData } from '@/src/types/itineraries';

interface BudgetBreakdownProps {
  itineraryData: ItineraryData;
  basePrice: number;
  clientIsAuthenticated: boolean;
  onBooking: () => void;
  onLogin: () => void;
}

export default function BudgetBreakdown({
  itineraryData,
  basePrice,
  clientIsAuthenticated,
  onBooking,
  onLogin
}: BudgetBreakdownProps) {
  // Calculate accurate totals
  const activityCost = itineraryData?.activity_cost || 0;
  const lodgingCost = itineraryData?.lodging_cost || 0;
  const transportCost = itineraryData?.transport_cost || 0;
  const serviceFee = itineraryData?.service_fee || 0;
  const calculatedTotal = activityCost + lodgingCost + transportCost + serviceFee;
  const displayTotal = calculatedTotal > 0 ? calculatedTotal : basePrice;

  return (
    <div className='col-span-full mt-8 bg-[#141414] rounded-xl p-8'>
      <h2 className='text-2xl font-semibold mb-2'>Budget and Breakdown</h2>
      <p className='text-gray-400 text-sm mb-6'>Show price per person</p>

      <div className='grid lg:grid-cols-[300px_1fr] gap-8'>
        {/* Recharts Pie Chart */}
        <div className='flex flex-col items-center'>
          <div className='relative w-48 h-48 mx-auto mb-4 flex items-center justify-center'>
            <div className='flex-shrink-0'>
              <ItineraryFilterPieChart
                data={[
                  { name: 'Activities', value: activityCost },
                  { name: 'Lodging', value: lodgingCost },
                  { name: 'Transportation', value: transportCost },
                  { name: 'Service Fee', value: serviceFee }
                ]}
              />
            </div>
          </div>

          <div className='space-y-2 w-full'>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-[#EF4444] rounded' />
              <span className='text-sm flex-1'>Activities</span>
              <span className='text-sm font-medium'>${activityCost.toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-[#3B82F6] rounded' />
              <span className='text-sm flex-1'>Lodging</span>
              <span className='text-sm font-medium'>${lodgingCost.toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-[#FFC107] rounded' />
              <span className='text-sm flex-1'>Transport</span>
              <span className='text-sm font-medium'>${transportCost.toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-gray-500 rounded' />
              <span className='text-sm flex-1'>Service Fee</span>
              <span className='text-sm font-medium'>${serviceFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown with Interactive Bar Graph */}
        <div className='space-y-6'>
          <div className='grid grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='bg-gray-800 rounded-lg p-4 mb-2'>
                <div className='w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-lg flex items-center justify-center'>
                  <MdOutlineExplore className='h-6 w-6 text-blue-500' />
                </div>
                <p className='text-2xl font-bold'>${itineraryData?.activity_cost || 0}.00</p>
              </div>
              <p className='text-xs text-gray-400'>Activities • {Math.round(((itineraryData?.activity_cost || 0) / basePrice) * 100)}%</p>
            </div>

            <div className='text-center'>
              <div className='bg-gray-800 rounded-lg p-4 mb-2'>
                <div className='w-12 h-12 mx-auto mb-2 bg-green-500/20 rounded-lg flex items-center justify-center'>
                  <GoHome className='h-6 w-6 text-green-500' />
                </div>
                <p className='text-2xl font-bold'>${itineraryData?.lodging_cost || 0}.00</p>
              </div>
              <p className='text-xs text-gray-400'>Lodging • {Math.round(((itineraryData?.lodging_cost || 0) / basePrice) * 100)}%</p>
            </div>

            <div className='text-center'>
              <div className='bg-gray-800 rounded-lg p-4 mb-2'>
                <div className='w-12 h-12 mx-auto mb-2 bg-red-500/20 rounded-lg flex items-center justify-center'>
                  <MdOutlineDirectionsCarFilled className='h-6 w-6 text-red-500' />
                </div>
                <p className='text-2xl font-bold'>${itineraryData?.transport_cost || 0}.00</p>
              </div>
              <p className='text-xs text-gray-400'>Transport • {Math.round(((itineraryData?.transport_cost || 0) / basePrice) * 100)}%</p>
            </div>

            <div className='text-center'>
              <div className='bg-gray-800 rounded-lg p-4 mb-2'>
                <div className='w-12 h-12 mx-auto mb-2 bg-yellow-500/20 rounded-lg flex items-center justify-center'>
                  <BiSolidMap className='h-6 w-6 text-yellow-500' />
                </div>
                <p className='text-2xl font-bold'>${itineraryData?.service_fee || 0}.00</p>
              </div>
              <p className='text-xs text-gray-400'>Service Fee</p>
            </div>
          </div>

          {/* Budget Comparison */}
          <div className='bg-gray-800/50 rounded-lg p-6'>
            <h3 className='text-lg font-semibold mb-4'>Cost Breakdown Details</h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between pb-3 border-b border-gray-700'>
                <span className='text-sm text-gray-400'>Subtotal (Activities + Lodging + Transport)</span>
                <span className='text-lg font-semibold'>${(activityCost + lodgingCost + transportCost).toFixed(2)}</span>
              </div>
              <div className='flex items-center justify-between pb-3 border-b border-gray-700'>
                <span className='text-sm text-gray-400'>Service Fee</span>
                <span className='text-lg font-semibold'>${serviceFee.toFixed(2)}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-base font-medium'>Total Price</span>
                <span className='text-2xl font-bold text-yellow-400'>${displayTotal.toFixed(2)}</span>
              </div>
              <div className='mt-4 p-4 bg-gray-900/50 rounded-lg'>
                <p className='text-xs text-gray-400 mb-2'>Price includes:</p>
                <ul className='text-xs text-gray-300 space-y-1'>
                  <li>• All activities and entrance fees</li>
                  <li>• Accommodation for the duration</li>
                  <li>• Transportation between locations</li>
                  <li>• 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 pt-8 border-t border-gray-800'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-2xl font-bold'>Total: ${displayTotal.toFixed(2)}</p>
            <p className='text-sm text-gray-400'>{serviceFee > 0 ? 'Service fee included' : 'Service fee not included'}</p>
          </div>
          {clientIsAuthenticated ? (
            <Button
              variant='primary'
              className='bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg'
              onClick={onBooking}
            >
              Proceed to Payment →
            </Button>
          ) : (
            <Button
              variant='primary'
              className='bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg'
              onClick={onLogin}
            >
              Login to Book →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
