/**
 * Mock Users for Testing Matchmaking
 * These can be used to simulate multiple players for development/testing
 */

export const mockPlayers = [
  {
    id: 'player_1',
    username: 'AlgoMaster',
    rating: 1800,
    wins: 45,
    losses: 12,
    avatar: 'algo_master'
  },
  {
    id: 'player_2',
    username: 'CodeNinja',
    rating: 1750,
    wins: 38,
    losses: 15,
    avatar: 'code_ninja'
  },
  {
    id: 'player_3',
    username: 'DataStructure_Dev',
    rating: 1650,
    wins: 32,
    losses: 18,
    avatar: 'data_dev'
  },
  {
    id: 'player_4',
    username: 'BinarySearcher',
    rating: 1550,
    wins: 28,
    losses: 22,
    avatar: 'binary_searcher'
  },
  {
    id: 'player_5',
    username: 'FastCoder',
    rating: 1500,
    wins: 25,
    losses: 25,
    avatar: 'fast_coder'
  },
  {
    id: 'player_6',
    username: 'LeetCode_Pro',
    rating: 1450,
    wins: 20,
    losses: 30,
    avatar: 'leetcode_pro'
  },
  {
    id: 'player_7',
    username: 'SortingExpert',
    rating: 1400,
    wins: 18,
    losses: 32,
    avatar: 'sorting_expert'
  },
  {
    id: 'player_8',
    username: 'GraphGenius',
    rating: 1350,
    wins: 15,
    losses: 35,
    avatar: 'graph_genius'
  }
];

/**
 * Get a random mock player for testing
 * Useful for simulating multiple concurrent players
 */
export function getRandomPlayer() {
  return mockPlayers[Math.floor(Math.random() * mockPlayers.length)];
}

/**
 * Get players within a rating range
 * Simulates finding matches with similar skill levels
 */
export function getPlayersInRange(targetRating, range = 200) {
  return mockPlayers.filter(player => 
    Math.abs(player.rating - targetRating) <= range
  );
}

export default mockPlayers;
