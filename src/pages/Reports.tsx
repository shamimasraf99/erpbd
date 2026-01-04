import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileText, 
  Download,
  Calendar
} from "lucide-react";

const reports = [
  {
    id: 1,
    title: "বিক্রয় রিপোর্ট",
    description: "মাসিক ও বার্ষিক বিক্রয় বিশ্লেষণ",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-600",
    category: "বিক্রয়"
  },
  {
    id: 2,
    title: "আয়-ব্যয় রিপোর্ট",
    description: "সম্পূর্ণ আর্থিক সারাংশ",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    category: "আর্থিক"
  },
  {
    id: 3,
    title: "কর্মচারী রিপোর্ট",
    description: "কর্মচারী উপস্থিতি ও পারফরম্যান্স",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
    category: "HR"
  },
  {
    id: 4,
    title: "প্রজেক্ট রিপোর্ট",
    description: "প্রজেক্ট অগ্রগতি ও বাজেট",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-600",
    category: "প্রজেক্ট"
  },
  {
    id: 5,
    title: "ইনভয়েস রিপোর্ট",
    description: "বকেয়া ও পরিশোধিত ইনভয়েস",
    icon: FileText,
    color: "bg-pink-100 text-pink-600",
    category: "আর্থিক"
  },
  {
    id: 6,
    title: "ক্লায়েন্ট রিপোর্ট",
    description: "ক্লায়েন্ট বিশ্লেষণ ও রেভিনিউ",
    icon: PieChart,
    color: "bg-cyan-100 text-cyan-600",
    category: "CRM"
  },
];

const recentReports = [
  { name: "জানুয়ারি বিক্রয় রিপোর্ট", date: "২ জানুয়ারি ২০২৬", size: "1.2 MB" },
  { name: "Q4 আর্থিক সারাংশ", date: "১ জানুয়ারি ২০২৬", size: "2.5 MB" },
  { name: "কর্মচারী মাসিক রিপোর্ট", date: "৩১ ডিসেম্বর ২০২৫", size: "856 KB" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">রিপোর্ট</h1>
          <p className="text-muted-foreground">বিভিন্ন বিশ্লেষণমূলক রিপোর্ট তৈরি করুন</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Calendar className="h-4 w-4 mr-2" />
          কাস্টম রিপোর্ট
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${report.color}`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline">{report.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  দেখুন
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সাম্প্রতিক রিপোর্ট</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date} • {report.size}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
