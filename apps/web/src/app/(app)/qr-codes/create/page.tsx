import { QrBuilder } from '@/components/qr/builder/QrBuilder';
import { PageContainer, Section } from '@/components/layout/page-container';

export default function CreateQrCodePage() {
  return (
    <PageContainer>
      <Section className="h-[calc(100vh-6rem)] py-4">
        <QrBuilder />
      </Section>
    </PageContainer>
  );
}
