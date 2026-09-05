import { TestPageComponent } from '@/components/test.component';
import { getMyTests, getPublicTests } from '@/api/test';

export default async function TestPage() {
    const myTestsResponse = await getMyTests();
    const publicTestsResponse = await getPublicTests();
    const myTests = myTestsResponse.success ? myTestsResponse.data.myTests : [];
    const publicTests = publicTestsResponse.success ? publicTestsResponse.data.publicTests : [];
    return (
        <div className="flex flex-col gap-4 px-10 py-6 w-full">
            <TestPageComponent myTests={myTests} publicTests={publicTests} />
        </div>
    );
}