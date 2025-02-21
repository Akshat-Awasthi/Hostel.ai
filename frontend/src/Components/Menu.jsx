import React, { useState } from 'react';
import MessMenu from "./lib/const/MessMenu.json"; // Ensure the path and filename are correct
import { MdOutlineRestaurantMenu, MdAnalytics, MdDownload, MdRestaurantMenu } from "react-icons/md";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';

const Menu = () => {
  const colors = ['bg-purple-200', 'bg-[#ACC3FD]', 'bg-[#BAE5F5]', 'bg-[#CCEFBF]'];
  const [openDialog, setOpenDialog] = useState(false);
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openNewMenuDialog, setOpenNewMenuDialog] = useState(false);
  const [newMenuData, setNewMenuData] = useState(null);
  const [generatingMenu, setGeneratingMenu] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          menuData: MessMenu
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      if (!data.analysis || !Array.isArray(data.analysis)) {
        throw new Error('Invalid response format');
      }

      setAnalysisData(data.analysis);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate analysis: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Create CSV content
    const headers = ['Day', 'Meal', 'Calories', 'Protein', 'Carbs', 'Fats'];
    const csvContent = [
      headers.join(','),
      ...analysisData.map(item => {
        const nutrients = item.nutritionalAnalysis;
        return [
          item.day,
          item.meal,
          nutrients.calories,
          nutrients.protein,
          nutrients.carbs,
          nutrients.fats
        ].join(',');
      })
    ].join('\n');

    // Download as CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nutritional-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateNewMenu = async () => {
    setGeneratingMenu(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Menu generation failed');
      }

      setNewMenuData(data.newMenu);
      setOpenNewMenuDialog(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate new menu: ' + error.message);
    } finally {
      setGeneratingMenu(false);
    }
  };

  const handleDownloadNewMenu = () => {
    // Get all meal times and days
    const mealTimes = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'];
    const days = newMenuData.map(day => day.day);
    
    // Create CSV content
    let csvContent = ['Meal Time,' + days.join(',')].join('\n');
    
    // Add each meal time row
    mealTimes.forEach(mealTime => {
      const row = [mealTime];
      
      // Add items for each day
      days.forEach(day => {
        const dayData = newMenuData.find(d => d.day === day);
        const meal = dayData.meals.find(m => m.time === mealTime);
        const items = meal ? meal.items.join('; ') : '';
        row.push(`"${items}"`); // Wrap in quotes to handle commas in items
      });
      
      csvContent += '\n' + row.join(',');
    });

    // Download as CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'weekly_menu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='min-h-screen bg-slate-100 p-4'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header Section */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center'>
                <MdOutlineRestaurantMenu className='text-2xl text-white' />
              </div>
              <div>
                <h1 className='text-lg font-bold text-gray-900'>Weekly Mess Menu</h1>
                <p className='text-xs text-gray-500'>View and analyze the complete mess menu</p>
              </div>
            </div>
            <div className='flex gap-3'>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MdAnalytics />}
                onClick={handleAnalyze}
                disabled={loading}
                size="small"
                className="bg-violet-600 hover:bg-violet-700 text-xs"
              >
                {loading ? 'Analyzing...' : 'Analyze Menu'}
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly Menu Horizontal Layout */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
          {/* Meal Times Header */}
          <div className='grid grid-cols-5 bg-gradient-to-r from-indigo-600 to-violet-600'>
            <div className='p-4 text-white font-medium text-sm'>
              Day
            </div>
            {['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'].map((mealTime, index) => (
              <div key={index} className='p-4 text-white font-medium text-base'>
                <div>{mealTime}</div>
                <div className='text-[10px] text-indigo-200 mt-1'>
                  {mealTime === 'Breakfast' ? '7:00 - 9:00' :
                   mealTime === 'Lunch' ? '12:30 - 1:00' :
                   mealTime === 'Evening Snacks' ? '5:00 - 6:00' :
                   '8:00 - 9:30'}
                </div>
              </div>
            ))}
          </div>

          {/* Days and Items */}
          {MessMenu.map((day, dayIndex) => (
            <div key={dayIndex} className='grid grid-cols-5 border-b border-gray-100 last:border-b-0'>
              {/* Day Column */}
              <div className={`p-4 ${
                dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}>
                <span className='text-sm font-semibold text-gray-900'>{day.day}</span>
              </div>

              {/* Menu Items for Each Meal */}
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((mealTime, timeIndex) => {
                const meal = day.meals.find(m => m.time === mealTime);
                return (
                  <div 
                    key={`${day.day}-${mealTime}`} 
                    className={`p-4 ${
                      dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {meal && (
                      <ul className='space-y-1.5'>
                        {meal.items.map((item, itemIndex) => (
                          <li 
                            key={itemIndex} 
                            className='text-sm text-gray-700 flex items-center gap-2'
                          >
                            <span className='h-1 w-1 bg-gray-400 rounded-full'></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Time Legend */}
        <div className='bg-white rounded-2xl p-4 shadow-sm'>
          <div className='grid grid-cols-4 gap-4'>
            {[
              { meal: 'Breakfast', time: '7:00 - 9:00' },
              { meal: 'Lunch', time: '12:30 - 1:00' },
              { meal: 'Evening Snacks', time: '5:00 - 6:00' },
              { meal: 'Dinner', time: '8:00 - 9:30' }
            ].map((item, index) => (
              <div key={index} className='flex items-center gap-3 bg-gray-50 rounded-xl p-3'>
                <div className='h-2 w-2 rounded-full bg-violet-500'></div>
                <div>
                  <div className='text-xs font-medium text-gray-900'>{item.meal}</div>
                  <div className='text-[10px] text-gray-500'>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Dialog - Only reordered columns */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle className="flex justify-between items-center">
            Menu Analysis
            <div className="flex gap-2">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MdDownload />}
                onClick={handleDownload}
              >
                Download Nutrients Chart
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MdRestaurantMenu />}
                onClick={handleGenerateNewMenu}
                disabled={generatingMenu}
              >
                {generatingMenu ? 'Generating...' : 'Generate New Menu'}
              </Button>
            </div>
          </DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="menu analysis table">
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Meal</TableCell>
                    <TableCell>Nutritional Analysis</TableCell>
                    <TableCell>Review Analysis</TableCell>
                    <TableCell>Recommendations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analysisData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.day}</TableCell>
                      <TableCell>{row.meal}</TableCell>
                      <TableCell>
                        <div>Calories: {row.nutritionalAnalysis.calories}</div>
                        <div>Protein: {row.nutritionalAnalysis.protein}g</div>
                        <div>Carbs: {row.nutritionalAnalysis.carbs}g</div>
                        <div>Fats: {row.nutritionalAnalysis.fats}g</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-green-600">✓ {row.reviewAnalysis.positive}</div>
                        <div className="text-red-600">✗ {row.reviewAnalysis.negative}</div>
                      </TableCell>
                      <TableCell>{row.recommendations}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>

        {/* New Menu Dialog */}
        <Dialog
          open={openNewMenuDialog}
          onClose={() => setOpenNewMenuDialog(false)}
          maxWidth="xl"
          fullWidth
        >
          <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex items-center gap-2">
              <MdRestaurantMenu className="text-2xl" />
              <span className="font-bold">Generated Menu Plan</span>
            </div>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<MdDownload />}
              onClick={handleDownloadNewMenu}
              className="text-white border-white hover:bg-white/10"
            >
              Download Menu
            </Button>
          </DialogTitle>
          <DialogContent className="mt-4">
            <TableContainer 
              component={Paper} 
              elevation={0}
              className="border rounded-lg overflow-hidden"
            >
              <Table sx={{ minWidth: 650 }} aria-label="new menu table">
                <TableHead>
                  <TableRow>
                    <TableCell 
                      className="bg-gray-50 font-semibold text-gray-700"
                      sx={{ minWidth: '120px' }}
                    >
                      Meal Time
                    </TableCell>
                    {newMenuData?.map((day, index) => (
                      <TableCell 
                        key={index} 
                        align="center"
                        className="bg-gray-50 font-semibold text-gray-700"
                      >
                        {day.day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'].map((mealTime, timeIndex) => (
                    <TableRow 
                      key={timeIndex}
                      className={timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        className="font-medium text-gray-700 bg-gray-50/30"
                      >
                        {mealTime}
                      </TableCell>
                      {newMenuData?.map((day, dayIndex) => {
                        const meal = day.meals.find(m => m.time === mealTime);
                        return <MenuCell key={dayIndex} meal={meal} />;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const MenuCell = ({ meal }) => {
  if (!meal) return <TableCell />;

  return (
    <TableCell className="relative">
      <div className="flex justify-between items-start p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
        <ul className="list-disc pl-4 mb-2 space-y-1.5">
          {meal.items.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ul>
        <Tooltip
          title={
            <Card elevation={0}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom className="font-semibold border-b pb-2">
                  Nutritional Information
                </Typography>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">🔥</span>
                    <Typography variant="body2">
                      Calories: {meal.nutritionalInfo.calories}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">🥩</span>
                    <Typography variant="body2">
                      Protein: {meal.nutritionalInfo.protein}g
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">🌾</span>
                    <Typography variant="body2">
                      Carbs: {meal.nutritionalInfo.carbs}g
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">🥑</span>
                    <Typography variant="body2">
                      Fats: {meal.nutritionalInfo.fats}g
                    </Typography>
                  </div>
                </div>
                <Typography variant="subtitle1" color="primary" className="font-semibold mt-4 border-b pb-2">
                  Improvements
                </Typography>
                <Typography variant="body2" className="mt-2">
                  {meal.improvements}
                </Typography>
              </CardContent>
            </Card>
          }
          placement="right"
          arrow
        >
          <InfoIcon 
            fontSize="small" 
            color="primary"
            className="cursor-pointer hover:text-blue-700 transition-colors"
          />
        </Tooltip>
      </div>
    </TableCell>
  );
};

export default Menu;
