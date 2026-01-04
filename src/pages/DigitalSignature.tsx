import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSignature, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useContracts } from "@/hooks/useContracts";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const DigitalSignature = () => {
  const { data: contracts, isLoading } = useContracts();

  const pendingSignatures = contracts?.filter(c => !c.signed_by_client || !c.signed_by_company) || [];
  const completedSignatures = contracts?.filter(c => c.signed_by_client && c.signed_by_company) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ডিজিটাল সিগনেচার</h1>
          <p className="text-muted-foreground">চুক্তিপত্রে ডিজিটাল স্বাক্ষর</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">অপেক্ষমান সই</p>
                <p className="text-xl font-bold">{pendingSignatures.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">সম্পন্ন সই</p>
                <p className="text-xl font-bold">{completedSignatures.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileSignature className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট চুক্তি</p>
                <p className="text-xl font-bold">{contracts?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {pendingSignatures.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            সই অপেক্ষমান
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingSignatures.map((contract) => (
              <Card key={contract.id} className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{contract.title}</CardTitle>
                      <CardDescription>{contract.contract_number}</CardDescription>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">অপেক্ষমান</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ক্লায়েন্ট</p>
                    <p className="font-medium">{contract.client?.name || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">মূল্য</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(contract.value)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">ক্লায়েন্ট সই</span>
                      {contract.signed_by_client ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">অপেক্ষমান</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">কোম্পানি সই</span>
                      {contract.signed_by_company ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">অপেক্ষমান</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {!contract.signed_by_company && (
                      <Button size="sm" className="flex-1">
                        <FileSignature className="h-4 w-4 mr-2" />
                        সই করুন
                      </Button>
                    )}
                    {!contract.signed_by_client && (
                      <Button size="sm" variant="outline" className="flex-1">
                        সই অনুরোধ পাঠান
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedSignatures.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            সই সম্পন্ন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedSignatures.map((contract) => (
              <Card key={contract.id} className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{contract.title}</CardTitle>
                      <CardDescription>{contract.contract_number}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">সম্পন্ন</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ক্লায়েন্ট</p>
                    <p className="font-medium">{contract.client?.name || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">মূল্য</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(contract.value)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">ক্লায়েন্ট সই</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {contract.client_signature_date && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(contract.client_signature_date), 'dd MMM', { locale: bn })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-sm">কোম্পানি সই</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {contract.company_signature_date && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(contract.company_signature_date), 'dd MMM', { locale: bn })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full">
                    ডকুমেন্ট দেখুন
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalSignature;
