import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { mockStoryChapters } from "../mock/mockData";
import { 
  BookOpen, 
  Play, 
  Lock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Clock,
  Trophy
} from "lucide-react";

const Story = () => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [readingMode, setReadingMode] = useState(false);

  const ChapterCard = ({ chapter, index }) => (
    <Card 
      className={`bg-gray-800 border-gray-700 transition-all cursor-pointer ${
        chapter.unlocked ? 'hover:border-purple-500' : 'opacity-50'
      }`}
      onClick={() => chapter.unlocked && setSelectedChapter(chapter)}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            chapter.completed ? 'bg-green-600' : 
            chapter.unlocked ? 'bg-purple-600' : 'bg-gray-600'
          }`}>
            {chapter.completed ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : chapter.unlocked ? (
              <BookOpen className="w-6 h-6 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">Chapter {index + 1}</h3>
              {chapter.completed && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Completed
                </Badge>
              )}
              {!chapter.unlocked && (
                <Badge variant="outline" className="text-gray-400 border-gray-400">
                  Locked
                </Badge>
              )}
            </div>
            <h4 className="text-lg font-bold text-purple-400 mt-1">{chapter.title}</h4>
            <p className="text-gray-400 mt-1">{chapter.description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {chapter.unlocked && (
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setReadingMode(true);
                  setSelectedChapter(chapter);
                }}
              >
                <Play className="w-4 h-4 mr-1" />
                {chapter.completed ? 'Replay' : 'Start'}
              </Button>
            )}
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StoryReader = ({ chapter }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const storyPages = [
      {
        title: chapter.title,
        content: "The story begins with our protagonist facing a new challenge...",
        image: null
      },
      {
        title: "The Journey Continues",
        content: "As the adventure unfolds, new mysteries are revealed...",
        image: null
      },
      {
        title: "The Climax",
        content: "The final confrontation approaches...",
        image: null
      }
    ];

    const handleNextPage = () => {
      if (currentPage < storyPages.length - 1) {
        setCurrentPage(prev => prev + 1);
      } else {
        setReadingMode(false);
        setSelectedChapter(null);
      }
    };

    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    };

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{storyPages[currentPage].title}</CardTitle>
            <Badge variant="outline">
              {currentPage + 1} / {storyPages.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-6 min-h-[300px]">
            <p className="text-gray-300 text-lg leading-relaxed">
              {storyPages[currentPage].content}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Progress value={((currentPage + 1) / storyPages.length) * 100} className="flex-1" />
            <span className="text-sm text-gray-400">
              {currentPage + 1}/{storyPages.length}
            </span>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={() => {
                setReadingMode(false);
                setSelectedChapter(null);
              }}
              variant="outline"
            >
              Close
            </Button>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleNextPage}
            >
              {currentPage === storyPages.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const completedChapters = mockStoryChapters.filter(chapter => chapter.completed).length;
  const totalChapters = mockStoryChapters.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Story Mode</h1>
            <p className="text-xl text-purple-200">Follow the journey of the Shadow Monarch</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-200">Progress</div>
            <div className="text-4xl font-bold">{completedChapters}/{totalChapters}</div>
          </div>
        </div>
      </div>

      {/* Story Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Chapters</div>
                <div className="text-xl font-bold text-white">{totalChapters}</div>
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
                <div className="text-xl font-bold text-white">{completedChapters}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Reading Time</div>
                <div className="text-xl font-bold text-white">2.5h</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Achievements</div>
                <div className="text-xl font-bold text-white">7</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Story Progress */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Story Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white">{Math.round((completedChapters / totalChapters) * 100)}%</span>
            </div>
            <Progress value={(completedChapters / totalChapters) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Story Content */}
      {readingMode && selectedChapter ? (
        <StoryReader chapter={selectedChapter} />
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Chapters</h2>
          <div className="space-y-4">
            {mockStoryChapters.map((chapter, index) => (
              <ChapterCard key={chapter.id} chapter={chapter} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Story;