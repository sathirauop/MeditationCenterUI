'use client';

import { useTranslations } from 'next-intl';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
    const t = useTranslations('FAQ');

    return (
        <section id="faq" className="py-20 bg-background">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{t('title')}</h2>
                    <p className="text-muted-foreground text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg text-left">{t('q1')}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {t('a1')}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg text-left">{t('q2')}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {t('a2')}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg text-left">{t('q3')}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {t('a3')}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-lg text-left">{t('q4')}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {t('a4')}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-lg text-left">{t('q5')}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {t('a5')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )
}

