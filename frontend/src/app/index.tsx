import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated,
  Platform,
  TextStyle,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// مصفوفة الصور الخاصة بالمعرض (Fade Gallery)
const galleryImages = [
  require('../../assets/images/1.jpeg'),
  require('../../assets/images/2.jpeg'),
  require('../../assets/images/3.jpeg'),
  require('../../assets/images/4.jpeg'),
];

export default function LandingScreen() {
  const router = useRouter();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState<boolean>(true);

  // 1. فحص الجلسة المحفوظة فور فتح التطبيق
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/home');
        }
      } else {
        setLoading(false); // إيقاف التحميل وإظهار الصفحة الرئيسية إذا لم يكن مسجلاً
      }
    } catch (error) {
      console.log('Error checking session:', error);
      setLoading(false);
    }
  };

  // 2. التحكم في عرض الصور بالتلاشي (Fade Effect)
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImgIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim, loading]);

  const goToLogin = () => {
    try {
      router.push('/login');
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  const textAlignStyle: TextStyle = { textAlign: lang === 'ar' ? 'right' : 'left' };

  // شاشة تحفيزية أثناء التحقق من الحساب
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8C6D46" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* خلفية بتدرجات زجاجية باللون البيج */}
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowCenter} />
      <View style={styles.bgGlowBottom} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* 1. الترويسة الزجاجية العلوية (Navbar) */}
        <View style={[styles.glassNavbar, lang === 'en' && styles.navbarEn]}>
          <View style={styles.navBrand}>
            <View style={styles.logoCircleWrapper}>
              <Image 
                source={require('../../assets/images/مكتبة .png')} 
                style={styles.brandLogoCircle} 
                resizeMode="cover" 
              />
            </View>
            <View style={styles.logoCircleWrapper}>
              <Image 
                source={require('../../assets/images/FB_IMG_1776379564764.jpg')} 
                style={styles.brandLogoCircle} 
                resizeMode="cover" 
              />
            </View>
            <View style={styles.logoCircleWrapper}>
              <Image 
                source={require('../../assets/images/Screenshot_20260417-004535_Facebook.jpg')} 
                style={styles.brandLogoCircle} 
                resizeMode="cover" 
              />
            </View>

            <View style={styles.brandTextGroup}>
              <Text style={styles.brandTitleText}>
                {lang === 'ar' ? 'مكتبة كلية العلوم' : 'Faculty of Science Library'}
              </Text>
              <Text style={styles.brandSubTitleText}>ZENTAN UNIVERSITY</Text>
            </View>
          </View>

          <View style={styles.navActions}>
            <TouchableOpacity 
              style={styles.glassLangBtn} 
              onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            >
              <Text style={styles.langBtnText}>🌐 {lang === 'ar' ? 'English' : 'عربي'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.glassLoginNavBtn} onPress={goToLogin}>
              <Text style={styles.loginNavBtnText}>
                {lang === 'ar' ? 'تسجيل الدخول 🔑' : 'Sign In 🔑'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. قسم البطل (Hero Section) ومعرض الصور المتلاشي */}
        <View style={styles.glassHeroCard}>
          <Text style={styles.heroBadge}>
            {lang === 'ar' ? '✨ البوابة الرقمية والمعرفية' : '✨ Digital & Knowledge Hub'}
          </Text>
          <Text style={styles.heroTitle}>
            {lang === 'ar' ? 'صرح العلوم والبحث العلمي' : 'Beacon of Science & Research'}
          </Text>
          <Text style={styles.heroSubTitle}>
            {lang === 'ar' 
              ? 'بيئة أكاديمية متكاملة تهدف لدعم الطلاب والباحثين بجمع المراجع والمصادر الرقمية الحديثة.' 
              : 'An integrated academic environment supporting students and researchers with modern digital resources.'}
          </Text>

          <View style={styles.fadeGalleryContainer}>
            <Animated.Image 
              source={galleryImages[currentImgIndex]} 
              style={[styles.fadeGalleryImage, { opacity: fadeAnim }]} 
              resizeMode="cover" 
            />
          </View>
        </View>

        {/* 3. بطاقة نبذة التأسيس الزجاجية */}
        <View style={styles.glassSectionCard}>
          <View style={[styles.sectionHeaderRow, lang === 'en' && styles.rowEn]}>
            <View style={styles.iconCircle}><Text style={styles.iconText}>📜</Text></View>
            <Text style={styles.sectionTitle}>
              {lang === 'ar' ? 'تأسيس الكلية والمكتبة' : 'About Foundation'}
            </Text>
          </View>
          
          <Text style={[styles.glassParagraph, textAlignStyle]}>
            {lang === 'ar' 
              ? 'تأسست كلية العلوم بالزنتان في 18 سبتمبر 1991، ونشأت المكتبة الخاصة بها بالتزامن مع تأسيس الكلية لتلبية احتياجات الطلاب والباحثين في التخصصات العلمية المختلفة ضمن جامعة الزنتان.'
              : 'The Faculty of Science in Zentan was established on September 18, 1991. Its library was created alongside the college to meet the needs of students and researchers within Zentan University.'}
          </Text>

          <View style={styles.gridInfoCards}>
            <View style={styles.glassMiniCard}>
              <Text style={styles.miniCardIcon}>📅</Text>
              <Text style={styles.miniCardTitle}>{lang === 'ar' ? '18 سبتمبر 1991' : 'Sep 18, 1991'}</Text>
              <Text style={styles.miniCardSub}>{lang === 'ar' ? 'تاريخ التأسيس' : 'Establishment'}</Text>
            </View>

            <View style={styles.glassMiniCard}>
              <Text style={styles.miniCardIcon}>🏛️</Text>
              <Text style={styles.miniCardTitle}>{lang === 'ar' ? 'النواة الأساسية' : 'Core Nucleus'}</Text>
              <Text style={styles.miniCardSub}>{lang === 'ar' ? 'انطلاقة الجامعة بالزنتان' : 'University Foundation'}</Text>
            </View>

            <View style={styles.glassMiniCard}>
              <Text style={styles.miniCardIcon}>📚</Text>
              <Text style={styles.miniCardTitle}>{lang === 'ar' ? 'مصادر متنوعة' : 'Rich Resources'}</Text>
              <Text style={styles.miniCardSub}>{lang === 'ar' ? 'كتب ودوريات علمية' : 'Books & Periodicals'}</Text>
            </View>
          </View>
        </View>

        {/* 4. بطاقة الأنشطة والفعاليات */}
        <View style={styles.glassSectionCard}>
          <View style={[styles.sectionHeaderRow, lang === 'en' && styles.rowEn]}>
            <View style={styles.iconCircle}><Text style={styles.iconText}>🎨</Text></View>
            <Text style={styles.sectionTitle}>
              {lang === 'ar' ? 'النشاطات والفعاليات' : 'Activities & Events'}
            </Text>
          </View>

          <View style={styles.activityContentRow}>
            <View style={styles.activityItem}>
              <Text style={[styles.actItemTitle, textAlignStyle]}>
                {lang === 'ar' ? '• المعارض العلمية والثقافية' : '• Scientific & Cultural Fairs'}
              </Text>
              <Text style={[styles.actItemSub, textAlignStyle]}>
                {lang === 'ar' ? 'تنظيم المعارض السنوية وورش العمل المتخصصة.' : 'Annual book fairs and scientific workshops.'}
              </Text>
            </View>

            <View style={styles.activityItem}>
              <Text style={[styles.actItemTitle, textAlignStyle]}>
                {lang === 'ar' ? '• الملتقيات والمبادرات الطلابية' : '• Student Initiatives'}
              </Text>
              <Text style={[styles.actItemSub, textAlignStyle]}>
                {lang === 'ar' ? 'دعم الأنشطة والمشاريع الأكاديمية المتميزة.' : 'Supporting academic initiatives and outstanding projects.'}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const fontFamilyStyle = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'Segoe UI, Roboto, Helvetica, sans-serif',
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F4EE',
  },
  bgGlowTop: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(212, 195, 163, 0.25)',
  },
  bgGlowCenter: {
    position: 'absolute',
    top: '40%',
    left: -150,
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: 'rgba(225, 213, 187, 0.2)',
  },
  bgGlowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(212, 195, 163, 0.2)',
  },
  scrollContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 25,
  },
  glassNavbar: {
    width: '100%',
    maxWidth: 1000,
    backgroundColor: 'rgba(255, 253, 249, 0.75)',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 225, 205, 0.9)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#8C6D46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  navbarEn: {
    flexDirection: 'row',
  },
  navBrand: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  logoCircleWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#C5B291',
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  brandLogoCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  brandTextGroup: {
    alignItems: 'flex-start',
  },
  brandTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#5C4326',
    fontFamily: fontFamilyStyle,
  },
  brandSubTitleText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#9E8462',
    letterSpacing: 1.2,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  glassLangBtn: {
    backgroundColor: 'rgba(212, 195, 163, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(197, 178, 145, 0.4)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  langBtnText: {
    color: '#6E5230',
    fontWeight: '800',
    fontSize: 12,
    fontFamily: fontFamilyStyle,
  },
  glassLoginNavBtn: {
    backgroundColor: '#8C6D46',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#8C6D46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  loginNavBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: fontFamilyStyle,
  },
  glassHeroCard: {
    width: '100%',
    maxWidth: 1000,
    backgroundColor: 'rgba(255, 253, 249, 0.7)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 225, 205, 0.85)',
    padding: 28,
    alignItems: 'center',
    shadowColor: '#8C6D46',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  heroBadge: {
    backgroundColor: 'rgba(212, 195, 163, 0.25)',
    color: '#6E5230',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 12,
    fontFamily: fontFamilyStyle,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#5C4326',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: fontFamilyStyle,
  },
  heroSubTitle: {
    fontSize: 14,
    color: '#7A644C',
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: fontFamilyStyle,
  },
  fadeGalleryContainer: {
    width: '100%',
    maxWidth: 650,
    height: 440,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(212, 195, 163, 0.4)',
    backgroundColor: 'rgba(235, 225, 205, 0.3)',
  },
  fadeGalleryImage: {
    width: '100%',
    height: '100%',
  },
  glassSectionCard: {
    width: '100%',
    maxWidth: 1000,
    backgroundColor: 'rgba(255, 253, 249, 0.75)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 225, 205, 0.85)',
    padding: 25,
    shadowColor: '#8C6D46',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  rowEn: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 195, 163, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#5C4326',
    fontFamily: fontFamilyStyle,
  },
  glassParagraph: {
    fontSize: 14,
    lineHeight: 24,
    color: '#65523D',
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: fontFamilyStyle,
  },
  gridInfoCards: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  glassMiniCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: 'rgba(247, 244, 238, 0.9)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 195, 163, 0.4)',
    alignItems: 'center',
  },
  miniCardIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  miniCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5C4326',
    marginBottom: 3,
    fontFamily: fontFamilyStyle,
  },
  miniCardSub: {
    fontSize: 12,
    color: '#8C6D46',
    fontFamily: fontFamilyStyle,
  },
  activityContentRow: {
    gap: 15,
    marginTop: 10,
  },
  activityItem: {
    backgroundColor: 'rgba(247, 244, 238, 0.7)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 195, 163, 0.3)',
  },
  actItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5C4326',
    marginBottom: 4,
    fontFamily: fontFamilyStyle,
  },
  actItemSub: {
    fontSize: 13,
    color: '#7A644C',
    fontFamily: fontFamilyStyle,
  },
});