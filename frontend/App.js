import React, { useEffect, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { API_BASE_URL } from "./config";

const C = {
  burgundy:"#7A1F35", olive:"#7B7D3B", cream:"#FFF8F5",
  white:"#FFFFFF", text:"#2F2A2A", muted:"#777"
};

export default function App() {
  const [page,setPage]=useState("home");
  const [services,setServices]=useState([]);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",service:"",date:"",time:"",notes:""});

  const loadServices=async()=>{
    try{
      setLoading(true);
      const r=await fetch(`${API_BASE_URL}/services`);
      if(!r.ok) throw new Error();
      setServices(await r.json());
    }catch(e){
      Alert.alert("تعذر الاتصال","تأكدي من رابط الـ API.");
    }finally{setLoading(false);}
  };

  useEffect(()=>{loadServices();},[]);
  const upd=(k,v)=>setForm(s=>({...s,[k]:v}));

  const submit=async()=>{
    if(!form.name||!form.phone||!form.service||!form.date||!form.time){
      Alert.alert("بيانات ناقصة","أكملي الاسم والهاتف والخدمة والتاريخ والوقت.");
      return;
    }
    try{
      const r=await fetch(`${API_BASE_URL}/bookings`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      const data=await r.json();
      if(!r.ok) return Alert.alert("خطأ",data.message||"لم يتم إرسال الحجز");
      Alert.alert("تم الحجز","تم استلام طلب الحجز بنجاح.");
      setForm({name:"",phone:"",service:"",date:"",time:"",notes:""});
      setPage("home");
    }catch(e){
      Alert.alert("تعذر الاتصال","تحققي من اتصال الإنترنت ورابط الـ API.");
    }
  };

  const Home=()=>(
    <ScrollView contentContainerStyle={s.page}>
      <View style={s.hero}>
        <View style={s.logo}><Text style={s.logoText}>ZK</Text></View>
        <Text style={s.title}>زينة الخليج للتجميل</Text>
        <Text style={s.subtitle}>Zinat Al Khalij Beauty Salon</Text>
        <Text style={s.location}>ولاية الرستاق – فلج الشراه</Text>
        <TouchableOpacity style={s.primary} onPress={()=>setPage("booking")}>
          <Text style={s.primaryText}>احجزي موعدك</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondary} onPress={()=>setPage("services")}>
          <Text style={s.secondaryText}>خدماتنا</Text>
        </TouchableOpacity>
      </View>
      <View style={s.card}>
        <Text style={s.heading}>مرحبًا بك</Text>
        <Text style={s.body}>احجزي خدمتك بسهولة من التطبيق.</Text>
      </View>
    </ScrollView>
  );

  const Services=()=>(
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.pageTitle}>خدماتنا</Text>
      {loading ? <ActivityIndicator size="large" color={C.burgundy}/> :
        services.map(x=>(
          <View key={x.id} style={s.card}>
            <Text style={s.serviceName}>{x.name}</Text>
          </View>
        ))
      }
    </ScrollView>
  );

  const Booking=()=>(
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.pageTitle}>حجز موعد</Text>
      <TextInput style={s.input} placeholder="اسم العميلة" value={form.name} onChangeText={v=>upd("name",v)} textAlign="right"/>
      <TextInput style={s.input} placeholder="رقم الهاتف" keyboardType="phone-pad" value={form.phone} onChangeText={v=>upd("phone",v)} textAlign="right"/>
      <Text style={s.label}>اختاري الخدمة:</Text>
      {services.map(x=>(
        <TouchableOpacity
          key={x.id}
          style={[s.option,form.service===x.name&&s.optionActive]}
          onPress={()=>upd("service",x.name)}>
          <Text style={[s.optionText,form.service===x.name&&s.optionTextActive]}>{x.name}</Text>
        </TouchableOpacity>
      ))}
      <TextInput style={s.input} placeholder="التاريخ مثال: 2026-10-01" value={form.date} onChangeText={v=>upd("date",v)} textAlign="right"/>
      <TextInput style={s.input} placeholder="الوقت مثال: 17:30" value={form.time} onChangeText={v=>upd("time",v)} textAlign="right"/>
      <TextInput style={[s.input,{minHeight:90}]} placeholder="ملاحظات إضافية" value={form.notes} onChangeText={v=>upd("notes",v)} multiline textAlign="right"/>
      <TouchableOpacity style={s.primary} onPress={submit}>
        <Text style={s.primaryText}>تأكيد الحجز</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const Contact=()=>(
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.pageTitle}>تواصل معنا</Text>
      <View style={s.card}>
        <Text style={s.contact}>📍 ولاية الرستاق – فلج الشراه – سلطنة عُمان</Text>
        <Text style={s.contact}>📱 98505969</Text>
        <Text style={s.contact}>📸 @zinat_alkhalij</Text>
      </View>
    </ScrollView>
  );

  const content=page==="services"?<Services/>:page==="booking"?<Booking/>:page==="contact"?<Contact/>:<Home/>;

  return(
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark"/>
      <View style={s.container}>
        {content}
        <View style={s.nav}>
          {[["home","الرئيسية"],["services","الخدمات"],["booking","الحجز"],["contact","التواصل"]].map(([k,l])=>(
            <TouchableOpacity key={k} style={s.navItem} onPress={()=>setPage(k)}>
              <Text style={[s.navText,page===k&&s.navActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.white},
  container:{flex:1,backgroundColor:C.cream},
  page:{padding:20,paddingBottom:100},
  hero:{backgroundColor:C.burgundy,borderRadius:26,padding:24,alignItems:"center",marginTop:10},
  logo:{width:80,height:80,borderRadius:40,backgroundColor:C.white,alignItems:"center",justifyContent:"center",marginBottom:14},
  logoText:{color:C.burgundy,fontSize:28,fontWeight:"800"},
  title:{color:C.white,fontSize:27,fontWeight:"800",textAlign:"center"},
  subtitle:{color:C.white,marginTop:6,fontSize:15},
  location:{color:"#F7DDE5",marginTop:8,marginBottom:16},
  primary:{width:"100%",backgroundColor:C.olive,padding:15,borderRadius:14,marginTop:12,alignItems:"center"},
  primaryText:{color:C.white,fontSize:16,fontWeight:"800"},
  secondary:{width:"100%",backgroundColor:C.white,padding:15,borderRadius:14,marginTop:10,alignItems:"center"},
  secondaryText:{color:C.burgundy,fontSize:16,fontWeight:"800"},
  card:{backgroundColor:C.white,borderRadius:18,padding:18,marginTop:10},
  heading:{fontSize:19,fontWeight:"800",color:C.burgundy,textAlign:"right"},
  body:{marginTop:8,color:C.text,textAlign:"right"},
  pageTitle:{fontSize:27,fontWeight:"800",color:C.burgundy,marginBottom:18,textAlign:"right"},
  serviceName:{fontSize:17,color:C.text,fontWeight:"700",textAlign:"right"},
  input:{backgroundColor:C.white,borderWidth:1,borderColor:"#E4D4D9",paddingHorizontal:14,paddingVertical:13,borderRadius:14,marginBottom:12,fontSize:15},
  label:{fontWeight:"700",color:C.text,marginBottom:8,textAlign:"right"},
  option:{backgroundColor:C.white,borderWidth:1,borderColor:"#E4D4D9",padding:12,borderRadius:12,marginBottom:8},
  optionActive:{backgroundColor:C.burgundy,borderColor:C.burgundy},
  optionText:{color:C.text,textAlign:"right"},
  optionTextActive:{color:C.white,fontWeight:"700"},
  contact:{fontSize:16,marginVertical:7,textAlign:"right"},
  nav:{position:"absolute",bottom:0,left:0,right:0,height:72,backgroundColor:C.white,flexDirection:"row-reverse",borderTopWidth:1,borderTopColor:"#EEE",paddingBottom:8},
  navItem:{flex:1,alignItems:"center",justifyContent:"center"},
  navText:{color:C.muted,fontSize:13},
  navActive:{color:C.burgundy,fontWeight:"800"}
});
