import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { mockGuildMembers } from "../mock/mockData";
import { 
  Users, 
  Crown, 
  Star, 
  MessageCircle, 
  Settings, 
  Plus,
  Shield,
  Trophy,
  Target,
  Calendar
} from "lucide-react";

const Guild = () => {
  const { player } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);

  const getRankColor = (rank) => {
    const colors = {
      'E': 'text-gray-400 border-gray-400',
      'D': 'text-green-400 border-green-400',
      'C': 'text-blue-400 border-blue-400',
      'B': 'text-purple-400 border-purple-400',
      'A': 'text-yellow-400 border-yellow-400',
      'S': 'text-red-400 border-red-400'
    };
    return colors[rank] || 'text-gray-400 border-gray-400';
  };

  const MemberCard = ({ member }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{member.name}</h3>
              {member.position === "Guild Master" && (
                <Crown className="w-4 h-4 text-yellow-400" />
              )}
              <div className={`w-3 h-3 rounded-full ${
                member.online ? 'bg-green-400' : 'bg-gray-400'
              }`} />
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className={`text-xs ${getRankColor(member.rank)}`}>
                {member.rank}-Rank
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Level {member.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {member.position}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const guildActivities = [
    {
      id: 1,
      type: "raid",
      title: "Red Gate Raid",
      description: "Guild cleared Red Gate dungeon",
      timestamp: "2 hours ago",
      participants: ["Sung Jin-Woo", "Yoo Jin-Ho", "Park Hee-Jin"]
    },
    {
      id: 2,
      type: "join",
      title: "New Member",
      description: "Kim Sang-Shik joined the guild",
      timestamp: "1 day ago",
      participants: ["Kim Sang-Shik"]
    },
    {
      id: 3,
      type: "achievement",
      title: "Guild Achievement",
      description: "Reached 15 members milestone",
      timestamp: "3 days ago",
      participants: []
    }
  ];

  const guildStats = {
    totalMembers: mockGuildMembers.length,
    averageLevel: Math.round(mockGuildMembers.reduce((sum, member) => sum + member.level, 0) / mockGuildMembers.length),
    totalRaids: 47,
    guildRank: 3
  };

  return (
    <div className="space-y-6">
      {/* Guild Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{player.guild.name}</h1>
            <p className="text-xl text-purple-200">Elite Hunter Guild</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Rank #{guildStats.guildRank}
              </Badge>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {guildStats.totalMembers} Members
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Avg Level {guildStats.averageLevel}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-200">Guild Power</div>
            <div className="text-4xl font-bold">A+</div>
          </div>
        </div>
      </div>

      {/* Guild Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Total Members</div>
                <div className="text-xl font-bold text-white">{guildStats.totalMembers}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Average Level</div>
                <div className="text-xl font-bold text-white">{guildStats.averageLevel}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Raids Completed</div>
                <div className="text-xl font-bold text-white">{guildStats.totalRaids}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Guild Rank</div>
                <div className="text-xl font-bold text-white">#{guildStats.guildRank}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="raids">Raids</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Guild Members</h2>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockGuildMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
          
          <div className="space-y-4">
            {guildActivities.map((activity) => (
              <Card key={activity.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      {activity.type === "raid" && <Shield className="w-5 h-5 text-white" />}
                      {activity.type === "join" && <Plus className="w-5 h-5 text-white" />}
                      {activity.type === "achievement" && <Trophy className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{activity.title}</h3>
                      <p className="text-gray-400">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{activity.timestamp}</span>
                      </div>
                      {activity.participants.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {activity.participants.map((participant, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="raids" className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Guild Raids</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Weekly Raid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-400">Red Gate Instance</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      A-Rank
                    </Badge>
                    <Badge variant="secondary">
                      Saturday 8:00 PM
                    </Badge>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Join Raid
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Monthly Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-400">Demon Castle</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      S-Rank
                    </Badge>
                    <Badge variant="secondary">
                      Next Month
                    </Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Sign Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Guild Settings</h2>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Guild Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Guild Name</h3>
                  <p className="text-gray-400">Change your guild's name</p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Guild Description</h3>
                  <p className="text-gray-400">Update guild description</p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Member Permissions</h3>
                  <p className="text-gray-400">Manage member roles and permissions</p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Guild;