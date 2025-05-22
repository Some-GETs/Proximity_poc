import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

const UserCards = ({ users }:any) => {
  const [activeUser, setActiveUser] = useState(null);

  const getDistanceColor = (distance:any) => {
    if (distance < 100) return '#16a34a'; // green
    if (distance < 200) return '#ca8a04'; // yellow
    return '#dc2626'; // red
  };

  const getSocialMediaColor = (platform:any) => {
    switch (platform) {
      case 'instagram':
        return ['#E4405F', '#C13584'];
      case 'linkedin':
        return ['#0077B5', '#005885'];
      case 'twitter':
        return ['#1DA1F2', '#0D8BD9'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const handleUserPress = (userName:any) => {
    setActiveUser(activeUser === userName ? null : userName);
  };

  const socialIcons :any  = {
    instagram: require('../assets/instagram.png'),
    linkedin: require('../assets/linkedin.png'),
    twitter: require('../assets/twitter.png'),
  };
  
  const SocialMediaBadge = ({ platform, username }: any) => {
    const colors = getSocialMediaColor(platform);
    
    return (
      <View style={[styles.socialBadge, { backgroundColor: colors[0], flexDirection:'row', justifyContent:'space-between'}]}>
        <Image
          source={socialIcons[platform]}
          style={styles.socialBadgeIcon}
        />
        <Text style={styles.socialBadgeText}>{username}</Text>
      </View>
    );
  };

  const UserCard = ({ user, index }:any) => {
    const isActive = activeUser === user.name;
    
    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          isActive && styles.activeCard,
        ]}
        onPress={() => handleUserPress(user.name)}
        activeOpacity={0.8}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              {user.metadata?.pfp_url ? (
                <Image
                  source={{ uri: user.metadata.pfp_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Text style={styles.avatarText}>
                    {/* {user.name.split(' ').map((n:any) => n[0]).join('')} */}
                    { user.metadata?.full_name ?? user.name}
                  </Text>
                </View>
              )}
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.distanceContainer}>
                <View style={[styles.locationDot, { backgroundColor: getDistanceColor(user.distance) }]} />
                <Text style={[styles.userDistance, { color: getDistanceColor(user.distance) }]}>
                  {user.distance}m away
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Expanded Details */}
        {isActive && user.metadata && (
          <View style={styles.expandedContent}>
            <View style={styles.separator} />
            
            {/* Basic Info Row */}
            <View style={styles.basicInfoRow}>
              {user.metadata.age && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Age</Text>
                  <Text style={styles.infoValue}>{user.metadata.age}</Text>
                </View>
              )}
              {user.metadata.gender && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>{user.metadata.gender}</Text>
                </View>
              )}
            </View>

            {/* Contact Information */}
            {(user.metadata.mobile_no || user.metadata.email_id) && (
              <View style={styles.contactSection}>
                <Text style={styles.sectionTitle}>Contact</Text>
                {user.metadata.mobile_no && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactIcon}>📱</Text>
                    <Text style={styles.contactText}>{user.metadata.mobile_no}</Text>
                  </View>
                )}
                {user.metadata.email_id && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactIcon}>✉️</Text>
                    <Text style={styles.contactText}>{user.metadata.email_id}</Text>
                  </View>
                )}
                {user.metadata.profession && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactIcon}>💼</Text>
                    <Text style={styles.contactText}>{user.metadata.profession}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Social Media */}
            {user.metadata.social_media && (
              <View style={styles.socialSection}>
                <Text style={styles.sectionTitle}>Social Media</Text>
                <View style={styles.socialBadgesContainer}>
                  {user.metadata.social_media.instagram_username && (
                    <SocialMediaBadge 
                      platform="instagram" 
                      username={user.metadata.social_media.instagram_username} 
                    />
                  )}
                  {user.metadata.social_media.linkedin_username && (
                    <SocialMediaBadge 
                      platform="linkedin" 
                      username={user.metadata.social_media.linkedin_username} 
                    />
                  )}
                  {user.metadata.social_media.twitter && (
                    <SocialMediaBadge 
                      platform="twitter" 
                      username={user.metadata.social_media.twitter} 
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        )}
        
        {/* Expand Indicator */}
        <View style={styles.expandIndicatorContainer}>
          <View style={[
            styles.expandIndicator,
            { backgroundColor: isActive ? '#3B82F6' : '#D1D5DB' }
          ]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Users</Text>
      </View>
      
      <View style={styles.cardsContainer}>
        {users.map((user:any, index:any) => (
          <UserCard key={index} user={user} index={index} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    width: width * 0.8, // Add this line - controls card width (90% of screen)
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  activeCard: {
    borderWidth: 3,
    borderColor: '#3B82F6',
    transform: [{ scale: 1.02 }],
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  defaultAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  userDistance: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  basicInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  contactSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  socialSection: {
    marginBottom: 8,
  },
  socialBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  socialBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  expandIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  expandIndicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  socialBadgeIcon: {
    width: 14,
    height: 14,
  }
});

export default UserCards;