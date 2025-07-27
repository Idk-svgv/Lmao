import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockQuests } from "../mock/mockData";
import { 
  Target, 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock,
  Star,
  CheckCircle,
  Gift
} from "lucide-react";

const Quests = () => {
  const [selectedQuest, setSelectedQuest] = useState(null);

  const getQuestTypeColor = (type) => {
    const colors = {
      'Daily': 'text-green-400 border-green-400',
      'Weekly': 'text-blue-400 border-blue-400',
      'Monthly': 'text-purple-400 border-purple-400',
      'Story': 'text-yellow-400 border-yellow-400',
      'Special': 'text-red-400 border-red-400'
    };
    return colors[type] || 'text-gray-400 border-gray-400';
  };

  const getQuestTypeIcon = (type) => {
    const icons = {
      'Daily': Calendar,
      'Weekly': Target,
      'Monthly': Star,
      'Story': BookOpen,
      'Special': Trophy
    };
    return icons[type] || Target;
  };

  const QuestCard = ({ quest }) => {
    const Icon = getQuestTypeIcon(quest.type);
    const isCompleted = quest.progress >= quest.target;
    
    return (
      <Card 
        className={`bg-gray-800 border-gray-700 hover:border-purple-500 transition-all cursor-pointer ${
          isCompleted ? 'border-green-600' : ''
        }`}
        onClick={() => setSelectedQuest(quest)}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-600' : 'bg-purple-600'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <Icon className="w-6 h-6 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-white">{quest.title}</h3>
                <Badge variant="outline" className={getQuestTypeColor(quest.type)}>
                  {quest.type}
                </Badge>
                {isCompleted && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Completed
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-400 mb-3">{quest.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Progress:</span>
                  <Progress value={(quest.progress / quest.target) * 100} className="flex-1" />
                  <span className="text-sm text-gray-300">
                    {quest.progress}/{quest.target}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Reward: {quest.reward}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const QuestDetails = ({ quest }) => {
    const Icon = getQuestTypeIcon(quest.type);
    const isCompleted = quest.progress >= quest.target;
    
    return (
      <Card className="bg-gray-800 border-gray-700 sticky top-0">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-600' : 'bg-purple-600'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <Icon className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-white">{quest.title}</CardTitle>
              <Badge variant="outline" className={getQuestTypeColor(quest.type)}>
                {quest.type} Quest
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Description</h4>
            <p className="text-gray-300">{quest.description}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Progress</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Progress</span>
                <span className="text-white">{quest.progress}/{quest.target}</span>
              </div>
              <Progress value={(quest.progress / quest.target) * 100} className="h-2" />
              <div className="text-right">
                <span className="text-sm text-gray-400">
                  {Math.round((quest.progress / quest.target) * 100)}% Complete
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Reward</h4>
            <div className="flex items-center space-x-2 p-3 bg-gray-900 rounded-lg">
              <Gift className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400">{quest.reward}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              className={`w-full ${
                isCompleted 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={!isCompleted}
            >
              {isCompleted ? 'Claim Reward' : 'In Progress'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const questStats = {
    total: mockQuests.length,
    completed: mockQuests.filter(q => q.progress >= q.target).length,
    daily: mockQuests.filter(q => q.type === 'Daily').length,
    weekly: mockQuests.filter(q => q.type === 'Weekly').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quests</h1>
            <p className="text-xl text-purple-200">Complete quests to gain rewards and experience</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-200">Completed</div>
            <div className="text-4xl font-bold">{questStats.completed}/{questStats.total}</div>
          </div>
        </div>
      </div>

      {/* Quest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Total Quests</div>
                <div className="text-xl font-bold text-white">{questStats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-xl font-bold text-white">{questStats.completed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Daily Quests</div>
                <div className="text-xl font-bold text-white">{questStats.daily}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Weekly Quests</div>
                <div className="text-xl font-bold text-white">{questStats.weekly}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quest List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {mockQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </TabsContent>

            <TabsContent value="daily" className="space-y-4">
              {mockQuests.filter(q => q.type === 'Daily').map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              {mockQuests.filter(q => q.type === 'Weekly').map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </TabsContent>

            <TabsContent value="story" className="space-y-4">
              {mockQuests.filter(q => q.type === 'Story').map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {mockQuests.filter(q => q.progress >= q.target).map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Quest Details */}
        <div className="lg:col-span-1">
          {selectedQuest ? (
            <QuestDetails quest={selectedQuest} />
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a quest to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quests;